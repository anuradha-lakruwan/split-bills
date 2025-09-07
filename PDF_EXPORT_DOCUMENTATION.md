# PDF Export Feature Documentation

## Overview
The PDF export feature replaces the previous CSV export functionality and provides comprehensive, well-formatted PDF reports for split bill groups.

## Features

### 1. **Complete PDF Export** (`exportCompletePDF`)
- **Full group report** with all details
- **Sections included:**
  - Group summary (members, expenses, total amounts)
  - Member list with contact details
  - Detailed expense breakdown
  - Settlement suggestions
  - Completed settlements (if any)
  - Settlement calculation explanation
- **Available in:** GroupOverview and SettlementsPanel ("Full Report" button)

### 2. **Settlements Only PDF** (`exportSettlementsToPDF`)
- **Focused on settlements** only
- **Sections included:**
  - Group summary
  - Member list
  - Settlement suggestions only
- **Available in:** SettlementsPanel ("Export PDF" button)

### 3. **Customizable Export** (`exportToPDF`)
- **Flexible options** for different use cases
- **Configurable sections:**
  - `includeExpenses: boolean`
  - `includeSettlements: boolean`
  - `includeExplanation: boolean`
  - `includeMembers: boolean`

## PDF Features

### Professional Formatting
- **Clean layout** with proper spacing and typography
- **Automatic page breaks** to prevent content cutoff
- **Text wrapping** for long descriptions
- **Hierarchical headings** with proper font sizes and weights
- **Consistent styling** throughout the document

### Content Structure
1. **Header Section**
   - Group name and generation date
   - Professional title formatting

2. **Summary Section**
   - Key statistics (members, expenses, amounts, settlements)
   - Quick overview of group status

3. **Members Section**
   - Complete member list with email addresses
   - Numbered for easy reference

4. **Expenses Section**
   - Detailed expense breakdown
   - Amount, paid by, participants, and date for each expense
   - Clear hierarchical formatting

5. **Settlements Section**
   - Settlement suggestions with clear instructions
   - "From → To" format for easy understanding

6. **Completed Settlements**
   - Historical record of paid settlements
   - Includes payment dates

7. **Calculation Explanation**
   - Step-by-step breakdown of how settlements were calculated
   - Greedy algorithm explanation
   - Optimization details

### Technical Features
- **Automatic file naming** with group name and date
- **Error handling** with user-friendly messages
- **Page numbering** and footer information
- **Multi-page support** with consistent formatting

## Usage

### In SettlementsPanel
```typescript
// Two buttons available:
1. "Export PDF" - settlements only
2. "Full Report" - complete group report with explanation
```

### In GroupOverview  
```typescript
// Single button in header:
"Export PDF" - complete group report (only shows when expenses exist)
```

## File Naming Convention
- **Format:** `groupname_report_YYYY-MM-DD.pdf`
- **Example:** `weekend_trip_report_2025-01-15.pdf`
- **Sanitized:** Special characters replaced with underscores

## Dependencies
- **jsPDF:** Core PDF generation library
- **@types/jspdf:** TypeScript definitions

## Error Handling
- Try-catch blocks around all PDF generation calls
- User-friendly alert messages on failure
- Console error logging for debugging

## Benefits Over CSV
1. **Better Formatting:** Professional appearance vs plain text
2. **Complete Information:** Includes all details vs just basic data
3. **User Friendly:** Easy to read and share
4. **Self-Contained:** No need for additional software to view
5. **Professional:** Suitable for formal expense reporting
6. **Comprehensive:** Includes calculations explanation for transparency

## Implementation Notes
- Replaces previous CSV export functionality
- Maintains backward compatibility with existing group structure
- Uses existing utility functions for formatting
- Integrates with existing settlement explanation system
- Responsive to group data changes
