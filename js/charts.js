import { getMovements } from './api.js';

async function renderChart() {
    const movements = await getMovements();

    const labels = movements.map(mov => mov.description); // O el campo que uses para la fecha
    const dataIncomes = movements.map(mov => mov.type === 'increce' ? mov.amount : 0);
    const dataExpenses = movements.map(mov => mov.type === 'expense' ? mov.amount : 0);

    const ctx = document.getElementById('movementChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar', // Puedes usar 'line', 'pie', 'doughnut', etc.
        data: {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: dataIncomes,
                    backgroundColor: '#9effa3',
                },
                {
                    label: 'Gastos',
                    data: dataExpenses,
                    backgroundColor: '#ff6e6e',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Resumen de Movimientos'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

renderChart();


document.querySelector('.options-button').addEventListener('click', () => {
    const options = document.querySelectorAll('.options__icons');

    options.forEach(button => {
        button.classList.toggle('show');
    });
});