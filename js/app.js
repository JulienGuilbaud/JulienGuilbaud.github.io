// js/app.js

// Importe les données et les fonctions des autres modules.
import { vehicleData } from './data.js';
import { renderCards, showModal, hideModal, updateKpis, renderMarketCompositionChart } from './ui.js';

// Attend que le contenu de la page soit entièrement chargé.
document.addEventListener('DOMContentLoaded', () => {
    
    // Récupère les éléments du DOM nécessaires pour les interactions.
    const modal = document.getElementById('vendorModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Gère le clic sur un bouton de filtre.
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Met à jour le style du bouton actif.
            filterBtns.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md'));
            button.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md');
            
            // Affiche les cartes correspondant au filtre sélectionné.
            const filteredData = vehicleData.filter(v => button.dataset.filter === 'all' || v.category === button.dataset.filter);
            renderCards(filteredData, showModal);
        });
    });

    // Gère la fermeture de la fenêtre modale.
    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- Initialisation de l'application ---
    // Affiche toutes les cartes au chargement initial.
    renderCards(vehicleData, showModal);
    // Met à jour les KPIs (indicateurs clés de performance).
    updateKpis(vehicleData);
    // Crée le graphique de composition du marché.
    renderMarketCompositionChart(vehicleData);
});
