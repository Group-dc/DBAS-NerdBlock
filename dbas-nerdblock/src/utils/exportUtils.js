// src\utils\exportUtils.js
export function exportSubscriptionsToCSV(subscriptions) {
    const headers = ['ID', 'Customer', 'Genre', 'Start Date', 'End Date', 'Status'];
  
    const rows = subscriptions.map(sub => [
      sub.subscription_id,
      `${sub.Customer?.customer_first_name || ''} ${sub.Customer?.customer_last_name || ''}`,
      sub.Genre?.genre_name || '',
      sub.subscription_start_date,
      sub.subscription_end_date || 'Ongoing',
      sub.subscription_active ? 'Active' : 'Inactive'
    ]);
  
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subscriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  