import { useApp } from '@/context/AppContext';
import { Settlement } from '@/types';

export const useSettlement = () => {
  const { dispatch, state } = useApp();
  const { currentGroup } = state;

  const markSettlementAsPaid = (settlement: Settlement) => {
    if (!currentGroup) {
      console.error('No current group selected');
      return;
    }

    // Validate settlement data
    if (!settlement.from || !settlement.to || settlement.amount <= 0) {
      console.error('Invalid settlement data:', settlement);
      return;
    }

    // Check if settlement involves valid group members
    const fromMember = currentGroup.members.find(m => m.id === settlement.from);
    const toMember = currentGroup.members.find(m => m.id === settlement.to);
    
    if (!fromMember || !toMember) {
      console.error('Settlement involves unknown members:', { settlement, fromMember, toMember });
      return;
    }

    try {
      dispatch({
        type: 'MARK_SETTLEMENT_PAID',
        payload: {
          groupId: currentGroup.id,
          settlement
        }
      });
      
      console.log('Settlement marked as paid:', {
        from: fromMember.name,
        to: toMember.name,
        amount: settlement.amount
      });
    } catch (error) {
      console.error('Failed to mark settlement as paid:', error);
    }
  };

  return {
    markSettlementAsPaid
  };
};
