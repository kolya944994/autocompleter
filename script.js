class Markup {
	constructor() {
		this.Application = document.querySelector('#Application')

		this.searchInput = document.createElement('input')
		this.searchInput.classList.add('search-input')
		this.Application.append(this.searchInput)

		this.createUl = document.createElement('ul')
		this.createUl.classList.add('search-ul')
		this.Application.append(this.createUl)

		this.createCollection = document.createElement('ul')
		this.createCollection.classList.add('collection-ul')
		this.Application.append(this.createCollection)
	}
}

class Autocomplete {
	constructor(Markup) {
		this.Markup = Markup

		this.debouncedSearch = debounce(this.searchUsers.bind(this), 500)
		this.Markup.searchInput.addEventListener('keyup', this.debouncedSearch)
	}

	async searchUsers() {
		const query = this.Markup.searchInput.value.trim()
		if (!query) {
			this.Markup.createUl.replaceChildren()
			return
		}

		try {
			const response = await fetch(
				`https://api.github.com/search/repositories?q=${query}`
			)
			if (!response.ok) {
				throw new Error(`Ошибка: ${response.status}`)
			}

			const data = await response.json()
			const arr = data.items.slice(0, 5)
			this.Markup.createUl.replaceChildren()
			for (let rep of arr) {
				const li = document.createElement('li')
				li.classList.add('li-markup')
				li.textContent = rep.name
				this.Markup.createUl.append(li)

				li.addEventListener('click', () => {
					const liCollection = document.createElement('li')
					liCollection.classList.add('collection-li')
					liCollection.insertAdjacentHTML(
						'afterbegin',
						`
						Name: ${rep.name}<br>
						Owner: ${rep.owner.login}<br>
						Stars: ${rep.stargazers_count}
					`
					)

					const btn = document.createElement('button')
					btn.classList.add('btn-close')
					liCollection.append(btn)

					btn.addEventListener('click', e => {
						e.stopPropagation()
						liCollection.remove()
					})

					this.Markup.createCollection.append(liCollection)
				})
			}
		} catch (error) {
			console.error('Ошибка запроса:', error)
		}
	}
}

function debounce(fn, delay) {
	let timer
	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}

new Autocomplete(new Markup())
