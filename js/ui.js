// js/ui.js

// Récupère les éléments du DOM une seule fois pour une meilleure performance.
const grid = document.getElementById('vehicleGrid');
const modal = document.getElementById('vendorModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const cheapestModelName = document.getElementById('cheapestModelName');
const cheapestModelPrice = document.getElementById('cheapestModelPrice');
const priciestModelName = document.getElementById('priciestModelName');
const priciestModelPrice = document.getElementById('priciestModelPrice');
const marketChartCanvas = document.getElementById('marketCompositionChart');

let marketChart = null; // Pour garder une référence au graphique

/**
 * Affiche les cartes des véhicules dans la grille.
 * @param {Array} data - Les données des véhicules à afficher.
 * @param {function} onCardClick - La fonction à appeler lorsqu'une carte est cliquée.
 */
export function renderCards(data, onCardClick) {
    grid.innerHTML = '';
    data.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-enter';
        card.setAttribute('data-category', vehicle.category);
        
        const typeColor = vehicle.category === 'essence' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800';
        
        const escapedVehicleData = JSON.stringify(vehicle).replace(/'/g, "&#39;");

        card.innerHTML = `
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-semibold px-2 py-1 ${typeColor} rounded-full">${vehicle.type}</span>
                    <span class="text-xs font-bold text-slate-400">${vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-1">${vehicle.name}</h3>
                <p class="text-sm text-slate-500 mb-3">${vehicle.keyTakeaway}</p>
            </div>
            <div>
                <div class="text-right mb-4">
                    <p class="text-xs text-slate-400">Prix conseillé</p>
                    <p class="text-xl font-bold text-blue-600">${vehicle.priceRange}</p>
                </div>
                <button data-vehicle='${escapedVehicleData}' class="view-details-btn w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                    Voir les Détaillants
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', () => onCardClick(JSON.parse(button.dataset.vehicle)));
    });
}

/**
 * Affiche la fenêtre modale avec les détails d'un véhicule.
 * @param {object} vehicle - L'objet véhicule à afficher.
 */
export function showModal(vehicle) {
    modalTitle.textContent = `Prix pour : ${vehicle.name}`;
    
    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Détaillant</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">`;

    vehicle.vendors.sort((a, b) => a.price - b.price).forEach(vendor => {
        const statusClass = vendor.status === 'En stock' ? 'text-emerald-600' : 'text-amber-600';
        tableHtml += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">${vendor.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(vendor.price)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${statusClass}">${vendor.status}</td>
            </tr>
        `;
    });

    tableHtml += `</tbody></table></div>`;
    modalBody.innerHTML = tableHtml;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild.classList.remove('scale-95');
    }, 10);
}

/**
 * Cache la fenêtre modale.
 */
export function hideModal() {
     modal.classList.add('opacity-0');
     modal.firstElementChild.classList.add('scale-95');
     setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

/**
 * Met à jour les indicateurs de performance clés (KPIs).
 * @param {Array} data - L'ensemble des données des véhicules.
 */
export function updateKpis(data) {
    let cheapest = { price: Infinity };
    let priciest = { price: -Infinity };
    data.forEach(v => {
        const minPrice = Math.min(...v.vendors.map(p => p.price));
        if (minPrice < cheapest.price) {
            cheapest = { ...v, price: minPrice };
        }
        if (minPrice > priciest.price) {
            priciest = { ...v, price: minPrice };
        }
    });

    cheapestModelName.textContent = cheapest.name;
    cheapestModelPrice.textContent = `${new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(cheapest.price)}`;
    priciestModelName.textContent = priciest.name;
    priciestModelPrice.textContent = `${new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(priciest.price)}`;
}

/**
 * Crée le graphique de composition du marché.
 * @param {Array} data - L'ensemble des données des véhicules.
 */
export function renderMarketCompositionChart(data) {
    if (marketChart) {
        marketChart.destroy();
    }
    const categories = data.reduce((acc, v) => {
        const key = v.category === 'essence' ? 'Essence' : 'Électrique';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    marketChart = new Chart(marketChartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Nombre de Modèles',
                data: Object.values(categories),
                backgroundColor: ['#f97316', '#14b8a6'],
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, grid: { display: false }, ticks: { precision: 0 } },
                y: { grid: { display: false } }
            }
        }
    });
}

