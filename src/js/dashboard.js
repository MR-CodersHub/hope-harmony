/**
 * Dashboard Logic & Charts
 */

document.addEventListener('DOMContentLoaded', () => {
    initDonationChart();
});

function initDonationChart() {
    const ctx = document.getElementById('donationChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Donations ($)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#D97706',
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}
