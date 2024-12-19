document.addEventListener("DOMContentLoaded", () => {
	const developersField = document.getElementById("hidden-developers");
	// const keywordsField = document.getElementById("hidden-keywords");
	
	const selectButton = document.querySelector("[aria-haspopup='listbox']");
	const listbox = document.querySelector("[role='listbox']");
	const options = listbox.querySelectorAll("[role='option']");
	const addButton = document.getElementById("add-developer");
	const developerList = document.getElementById("developer-list");
	const developers = []; 

	document.querySelector("form").addEventListener("submit", (event) => {
		syncKeywords();
		console.log('será que foi', developerList.value, keywordsField.value)
	});

	let selectedOption = listbox.querySelector("[aria-selected='true']") || options[0];

	// Add data attributes to each option
	// biome-ignore lint/complexity/noForEach: <explanation>
	options.forEach((option) => {
		const img = option.querySelector("img").src;
		const name = option.querySelector(".truncate").textContent.trim();
		const id = option.getAttribute("data-id") || Date.now(); 

		option.dataset.id = id;
		option.dataset.name = name;
		option.dataset.avatar = img;
	});

	// Toggle listbox visibility
	selectButton.addEventListener("click", () => {
		const isExpanded = selectButton.getAttribute("aria-expanded") === "true";
		selectButton.setAttribute("aria-expanded", !isExpanded);
		listbox.classList.toggle("hidden", isExpanded);
	});

	// Handle option selection
	// biome-ignore lint/complexity/noForEach: <explanation>
	options.forEach((option) => {
		option.addEventListener("click", () => {
			console.log('aaa',selectedOption)
			// Update the selected option
			if (selectedOption) {
				selectedOption.removeAttribute("aria-selected");
				selectedOption.classList.remove("font-semibold");
			}
			option.setAttribute("aria-selected", "true");
			option.classList.add("font-semibold");
			selectedOption = option;

			// Update the button content
			const img = option.dataset.avatar;
			const name = option.dataset.name;

			const buttonContent = selectButton.querySelector(".flex");
			buttonContent.querySelector("img").src = img;
			buttonContent.querySelector(".truncate").textContent = name;

			// Close the listbox
			selectButton.setAttribute("aria-expanded", "false");
			listbox.classList.add("hidden");
		});
	});

	// Add developer to the list
	addButton.addEventListener("click", () => {
		if (selectedOption) {
			const developer = {
				id: selectedOption.dataset.id,
				name: selectedOption.dataset.name,
				avatar: selectedOption.dataset.avatar,
			};

			// Check if developer is already in the list
			if (!developers.some((dev) => dev.id === developer.id)) {
				developers.push(developer);

				developersField.value = JSON.stringify(developers.map(dev => dev.id)); 

				console.log(developers, developersField)

				const div = document.createElement("div");
				div.className =
					"group relative flex items-center p-4 rounded-lg bg-white shadow-xl ring-1 shadow-black/5 ring-slate-700/10";
				div.innerHTML = `
									<img src="${developer.avatar}" alt="" class="size-10 flex-none rounded-full">
									<div class="ml-4 flex-auto">
										<div class="font-medium">${developer.name}</div>
										<div class="mt-1 text-slate-700">Desenvolvedor</div>
									</div>
									<button type="button" class="ml-4 text-red-600 remove-developer"><i class="fas fa-trash"></i></button>
								`;
				developerList.appendChild(div);

				div.querySelector(".remove-developer").addEventListener("click", () => {
					const index = developers.findIndex((d) => d.id === developer.id);
					if (index !== -1) {
						developers.splice(index, 1);
						developersField.value = JSON.stringify(developers.map(dev => dev.id)); 
					}
					div.remove();
				});
			}
		}
	});

	// Close the listbox if clicked outside
	document.addEventListener("click", (event) => {
		if (
			!selectButton.contains(event.target) &&
			!listbox.contains(event.target)
		) {
			selectButton.setAttribute("aria-expanded", "false");
			listbox.classList.add("hidden");
		}
	});
});
