const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'suspended': return 'text-orange-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };


export { getStatusColor };