
export const getRandomColor = () => {
    const colors = [
      '#46E742',
      '#4287f5',
      '#f542a7',
      '#f5a442',
      '#8442f5',
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#F1948A',
      '#85C1E9',
      '#82E0AA',
      '#F8C471',
      '#D7BDE2',
      '#A3E4D7',
      '#F9E79F',
      '#AED6F1',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };