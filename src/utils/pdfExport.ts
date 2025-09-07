import jsPDF from 'jspdf';
import type { Member, Expense, PaidSettlement, Settlement } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import { generateSettlementExplanation } from './settlementExplanation';

interface PDFExportOptions {
  includeExpenses?: boolean;
  includeSettlements?: boolean;
  includeExplanation?: boolean;
  includeMembers?: boolean;
}

export const exportToPDF = (
  groupName: string,
  members: Member[],
  expenses: Expense[],
  settlements: Settlement[],
  paidSettlements: PaidSettlement[] = [],
  options: PDFExportOptions = {
    includeExpenses: true,
    includeSettlements: true,
    includeExplanation: true,
    includeMembers: true,
  }
) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 6;

  // Helper function to add a new page if needed
  const checkPageBreak = (additionalHeight: number = 20) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add text with automatic line wrapping
  const addWrappedText = (text: string, x: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, x, yPosition);
      yPosition += lineHeight;
    });
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Split Bills Report', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Group: ${groupName}`, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDate(new Date())}`, margin, yPosition);
  yPosition += 15;

  // Summary Section
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSettlements = settlements.length;

  addWrappedText(`• Total Members: ${members.length}`, margin + 5, 150);
  addWrappedText(`• Total Expenses: ${expenses.length}`, margin + 5, 150);
  addWrappedText(`• Total Amount Spent: ${formatCurrency(totalExpenseAmount)}`, margin + 5, 150);
  addWrappedText(`• Settlements Needed: ${totalSettlements}`, margin + 5, 150);
  yPosition += 10;

  // Members Section
  if (options.includeMembers && members.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Members', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    members.forEach((member, index) => {
      const memberText = member.email 
        ? `${index + 1}. ${member.name} (${member.email})`
        : `${index + 1}. ${member.name}`;
      addWrappedText(memberText, margin + 5, 150);
    });
    yPosition += 10;
  }

  // Expenses Section
  if (options.includeExpenses && expenses.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Expenses', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    expenses.forEach((expense, index) => {
      checkPageBreak(25);
      const paidBy = members.find(m => m.id === expense.paidBy)?.name || 'Unknown';
      const participantNames = expense.participants
        .map(id => members.find(m => m.id === id)?.name)
        .filter(Boolean);

      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${expense.description}`, margin + 5, yPosition);
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      addWrappedText(`   Amount: ${formatCurrency(expense.amount)}`, margin + 5, 150);
      addWrappedText(`   Paid by: ${paidBy}`, margin + 5, 150);
      addWrappedText(`   Participants: ${participantNames.join(', ')}`, margin + 5, 150);
      addWrappedText(`   Date: ${formatDate(expense.date)}`, margin + 5, 150);
      yPosition += 3;
    });
    yPosition += 10;
  }

  // Settlements Section
  if (options.includeSettlements && settlements.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Settlement Suggestions', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    settlements.forEach((settlement, index) => {
      checkPageBreak(15);
      const fromMember = members.find(m => m.id === settlement.from)?.name || 'Unknown';
      const toMember = members.find(m => m.id === settlement.to)?.name || 'Unknown';

      addWrappedText(
        `${index + 1}. ${fromMember} should pay ${formatCurrency(settlement.amount)} to ${toMember}`,
        margin + 5,
        150
      );
    });
    yPosition += 10;
  }

  // Paid Settlements Section (if any) - only include settlements with valid members
  const validPaidSettlements = paidSettlements.filter(settlement => {
    const fromMember = members.find(m => m.id === settlement.from);
    const toMember = members.find(m => m.id === settlement.to);
    return fromMember && toMember; // Only include if both members exist
  });

  if (validPaidSettlements.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Completed Settlements', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    validPaidSettlements.forEach((settlement, index) => {
      checkPageBreak(15);
      const fromMember = members.find(m => m.id === settlement.from)?.name || 'Unknown';
      const toMember = members.find(m => m.id === settlement.to)?.name || 'Unknown';

      addWrappedText(
        `${index + 1}. ${fromMember} paid ${formatCurrency(settlement.amount)} to ${toMember} on ${formatDate(settlement.datePaid)}`,
        margin + 5,
        150
      );
    });
    yPosition += 10;
  }

  // Settlement Explanation Section
  if (options.includeExplanation && settlements.length > 0) {
    try {
      checkPageBreak(40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('How Settlements Were Calculated', margin, yPosition);
      yPosition += 10;

      const explanation = generateSettlementExplanation(members, expenses, paidSettlements);

      explanation.steps.forEach((step) => {
        checkPageBreak(20);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        addWrappedText(step.title, margin + 5, 150, 12);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        addWrappedText(step.description, margin + 10, 140);
        yPosition += 3;
      });
    } catch (error) {
      console.error('Error generating settlement explanation:', error);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      addWrappedText('Settlement explanation could not be generated.', margin + 5, 150);
    }
  }

  // Footer on current page
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Generated by Split Bills App',
    margin,
    pageHeight - 10
  );

  // Download the PDF
  const fileName = `${groupName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Simplified PDF export for just settlements
export const exportSettlementsToPDF = (
  groupName: string,
  members: Member[],
  settlements: Settlement[]
) => {
  exportToPDF(groupName, members, [], settlements, [], {
    includeExpenses: false,
    includeSettlements: true,
    includeExplanation: false,
    includeMembers: true,
  });
};

// Complete PDF export with everything
export const exportCompletePDF = (
  groupName: string,
  members: Member[],
  expenses: Expense[],
  settlements: Settlement[],
  paidSettlements: PaidSettlement[] = []
) => {
  exportToPDF(groupName, members, expenses, settlements, paidSettlements, {
    includeExpenses: true,
    includeSettlements: true,
    includeExplanation: true,
    includeMembers: true,
  });
};
