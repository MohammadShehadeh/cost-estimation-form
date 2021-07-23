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
let maxPrice = 0;
let index = 0;

/**
 * Creates Estimated Nodes
 */
class Node {
	constructor(element) {
		this.question = element.getAttribute('data-question');
		this.answer = element.getAttribute('data-answer');
		this.price = parseInt(element.getAttribute('data-price'));
	}
}

/**
 * Calc Estimated data
 */
class Estimated {
	constructor() {
		this.userData = [];
		this.totalPrice = 0;
	}

	// set progress bar width
	setProgress() {
		progressBarPrice.innerText = `$${this.totalPrice}`;
		progressBar.style.width = `${(this.totalPrice/maxPrice) * 100}%`;
	}

	addSummaryTable(index) {
		summaryTableTotal.innerText = `$${this.totalPrice}`;
		summaryTableBody.innerHTML = `${summaryTableBody.innerHTML}
			<tr class="table-body__q">
				<td class="table-body__q--td">${this.userData[index].question}</td>
				<td class="table-body__q--td"></td>
			</tr>
			<tr class="table-body__a">
				<td class="table-body__a--td">${this.userData[index].answer}</td>
				<td class="table-body__a--td" align="right">$${this.userData[index].price}</td>
			</tr>
		`;
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
		this.totalPrice += this.userData[index].price;
		this.setProgress();
		this.addSummaryTable(index);
	}

	// remove pricing on previous
	removeEstimate(index) {
		this.totalPrice -= this.userData[index].price;
		this.userData.pop();
		this.setProgress();
		this.removeSummaryTable();
	}
}

/**
 * Inits estimate
 */
function startEstimate() {
	starBtn.remove();
	progressBarContainer.style.display = 'block';
	stages[0].style.display = 'block';
	estimatedNode = new Estimated();
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

	stages[index].style.display = 'none';
	stages[--index].style.display = 'block';
	estimatedNode.removeEstimate(index);
}

/**
 * Moves between stages forward
 */
function selectClick() {
	if (index < stages.length - 1) {
		stages[index].style.display = 'none';
		stages[++index].style.display = 'block';
		stagePrev.classList.add('stage-prev--show');
		stageEstimate.innerText = `$${estimatedNode.totalPrice}`;
	}
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
		const priceOptions = stageOptions[index].querySelectorAll('.stage-option [data-clickable="true"');

		for (let priceIndex = 0; priceIndex < priceOptions.length; priceIndex++) {
			const price = parseInt(priceOptions[priceIndex].getAttribute('data-price'));

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
	dataClickable = document.querySelectorAll('.stage-option [data-clickable="true"');
	summaryBtn = document.getElementsByClassName('summary-btn')[0];
	summaryTable = document.getElementsByClassName('summary-table');
	stagePrev = document.getElementsByClassName('stage-prev')[0];
	progressBar = document.getElementsByClassName('progress-bar')[0];
	stageEstimate = document.getElementsByClassName('stage__estimate')[0];
	progressBarPrice = document.getElementsByClassName('progress-bar-price')[0];
	summaryTableBody = document.getElementsByClassName('summary-table__body')[0];
	summaryTableTotal = document.getElementsByClassName('summary-footer__total--sum')[0];

	if (starBtn) {
		starBtn.addEventListener('click', () => {
			startEstimate();
		});
	}

	dataClickable.forEach(button => {
		button.addEventListener('click', () => {
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

	calcMaxPrice();
});
