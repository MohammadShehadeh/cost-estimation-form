let starBtn;
let progressBarContainer;
let progressBar;
let progressBarPrice;
let stages;
let stagePrev;
let estimatedNode;
let answer;
let dataClickable;
let summaryBtn;
let summaryTable;
let stageEstimate;
let summaryTableBody;
let summaryTableTotal;
let endSummaryTable;
let maxPrice = 0;
let index = 0;

/**
 * Creates Estimated Nodes
 */
class Node {
	constructor(element) {
		this.question = element.getAttribute('data-question');
		this.answer = element.getAttribute('data-answer');
		this.price = parseInt(element.getAttribute('data-price') || 0);
	}
}

/**
 * Calc Estimated data
 */
class Estimated {
	constructor() {
		this.userData = [];
		this.totalPrice = 0;
		this.dataTable = [];
	}

	// set progress bar width
	setProgress() {
		progressBarPrice.innerText = `$${this.totalPrice}`;
		progressBar.style.width = `${(this.totalPrice/maxPrice) * 100}%`;
	}

	addSummaryTable(idx) {
		summaryTableTotal.innerText = `$${this.totalPrice}`;
		summaryTableBody.innerHTML = `${summaryTableBody.innerHTML}
			<tr class="table-body__q expanded">
				<td class="table-body__q--td" data-index="${idx}">${this.userData[idx].question}</td>
				<td class="table-body__q--td"></td>
			</tr>
			<tr class="table-body__a expanded">
				<td class="table-body__a--td">${this.userData[idx].answer}</td>
				<td class="table-body__a--td" align="right">$${this.userData[idx].price}</td>
			</tr>
		`;

		let trArray = Array.from(summaryTableBody.querySelectorAll('tr'));
		trArray = trArray.slice(0, -2);

		trArray.forEach(element => {
			element.classList.remove('expanded');
		});
	}

	removeSummaryTable() {
		let { children: { length } = {}, children = {} } = summaryTableBody || {};
		summaryTableBody.removeChild(children[length - 1]);
		summaryTableBody.removeChild(children[length - 2]);
		summaryTableTotal.innerText = `$${this.totalPrice}`;
	}

	// set pricing on next
	setEstimate(element, index) {
		this.userData[index] = new Node(element);
		this.totalPrice += this.userData[index].price || 0;
		this.setProgress();
		this.addSummaryTable(index);
	}

	// remove pricing on previous
	removeEstimate(index) {
		this.totalPrice -= this.userData[index].price;
		this.userData.pop();
		this.setProgress();
		this.removeSummaryTable();
    
    const removeSelectedBtn = stages[index].querySelector('.stage-option [data-clickable="true"');
    removeSelectedBtn.setAttribute('data-clickable', 'false')
	}
}


function animateStart() {
	progressBarContainer.classList.add('start--animation');
	stages[0].classList.add('start--animation');
}

/**
 * Inits estimate
 */
function startEstimate() {
	starBtn.remove();
	progressBarContainer.classList.add('start');
	stages[0].classList.add('start');
	estimatedNode = new Estimated();
	setTimeout(animateStart, 400);
}

/**
 * Handles pricing data
 * @param {HTMLElement} button selected option
 */
function handlePricing(button) {
	estimatedNode.setEstimate(button, index);
}

/**
 * Moves between stages backward
 */
function prevClick() {
	if (index <= 1) {
		stagePrev.classList.remove('stage-prev--show');
	}

	stages[index].classList.remove('start');
	stages[index].classList.remove('start--animation');
	--index;
	stagePrev.style.opacity = 0;
	stagePrev.classList.add('stage-prev--show');
	setTimeout(() => stagePrev.style.opacity = 1, 750);
	stages[index].classList.add('start');
	setTimeout(() => stages[index].classList.add('start--animation'), 0.1);
	estimatedNode.removeEstimate(index);
}

/**
 * Moves between stages forward
 */
function selectClick() {
	if (index < stages.length - 1) {
		stages[index].classList.remove('start');
		stages[index].classList.remove('start--animation');
		++index;
		stages[index].classList.add('start');
		setTimeout(() => stages[index].classList.add('start--animation'), 0.5);
		stagePrev.style.opacity = 0;
		stagePrev.classList.add('stage-prev--show');
		setTimeout(() => stagePrev.style.opacity = 1, 750);
		stageEstimate.innerText = `$${estimatedNode.totalPrice}`;
	}

	if (endSummaryTable.firstChild) endSummaryTable.removeChild(endSummaryTable.firstChild);
	endSummaryTable.appendChild(summaryTable[0].cloneNode(true));
}

/**
 * Toggles summary table
 */
function toggleSummaryTable() {
	summaryTable[0].classList.toggle('summary-table--show');
}


/**
 * Gets possible Max price
 */
function calcMaxPrice() {
	const stageOptions = document.getElementsByClassName('stage__options');

	let maxNumber = 0;
	for (let index = 0; index < stageOptions.length; index++) {
		const priceOptions = stageOptions[index].querySelectorAll('.stage-option [data-clickable]');

		for (let priceIndex = 0; priceIndex < priceOptions.length; priceIndex++) {
			const price = parseInt(priceOptions[priceIndex].getAttribute('data-price') || 0);

			if (price > maxNumber) {
				maxNumber = price;
			}
		}

		maxPrice += maxNumber;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	starBtn = document.getElementById('estimate-btn');
	progressBarContainer = document.getElementsByClassName('pricing')[0];
	stages = document.getElementsByClassName('stages');
	dataClickable = document.querySelectorAll('.stage-option [data-clickable="false"');
	summaryBtn = document.getElementsByClassName('summary-btn')[0];
	summaryTable = document.getElementsByClassName('summary-table');
	stagePrev = document.getElementsByClassName('stage-prev')[0];
	progressBar = document.getElementsByClassName('progress-bar')[0];
	stageEstimate = document.getElementsByClassName('stage__estimate')[0];
	progressBarPrice = document.getElementsByClassName('progress-bar-price')[0];
	summaryTableBody = document.getElementsByClassName('summary-table__body')[0];
	summaryTableTotal = document.getElementsByClassName('summary-footer__total--sum')[0];
	endSummaryTable = document.getElementsByClassName('estimate-summary-table')[0];

	if (starBtn) {
		starBtn.addEventListener('click', () => {
			startEstimate();
		});
	}

	dataClickable.forEach(button => {
		button.addEventListener('click', () => {
		button.setAttribute('data-clickable', 'true');
			handlePricing(button, index);
			selectClick();
		});
	});

	if (stagePrev) {
		stagePrev.addEventListener('click', prevClick);
	}

	if (summaryBtn) {
		summaryBtn.addEventListener('click', toggleSummaryTable);
	}

	if (summaryTableBody) {
		summaryTableBody.addEventListener('click', (e) => {
			if (e.target.hasAttribute('data-index')) {
				targetIdx = parseInt(e.target.getAttribute('data-index'));
				while (index > parseInt(targetIdx)) {
					prevClick();
				}
			}
		});
	}

	calcMaxPrice();
});
