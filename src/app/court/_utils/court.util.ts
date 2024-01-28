export const convertPossibilityToDB = (possibility: string): string => {
  switch (possibility) {
    case '◎':
      return 'BothDays';
    case '◯':
      return 'EitherDay';
    case '△+':
      return 'Likely';
    case '△-':
      return 'Unlikely';
    case '☓':
      return 'NotAttending';
    case '-':
      return '';
    default:
      throw new Error('不正な値が指定されています');
  }
};

export const convertPossibilityToDisplay = (possibility: string): string => {
  switch (possibility) {
    case 'BothDays':
      return '◎';
    case 'EitherDay':
      return '◯';
    case 'Likely':
      return '△+';
    case 'Unlikely':
      return '△-';
    case 'NotAttending':
      return '☓';
    default:
      return '-';
  }
};
