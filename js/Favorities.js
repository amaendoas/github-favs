import { GithubUsers } from "./GithubUsers.js"

// clase que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorities {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const githubUser = await GithubUsers.search(username)
      if (githubUser.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [githubUser, ...this.entries] //...this.entries coloca os valores dentro do novo array com o novo githubUser
      this.update()
      this.save()
    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    //reatribuindo o novo array ao this.entries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualizção e eventos do HTML

export class FavoritiesView extends Favorities {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    this.entries.forEach(user => {
     const row = this.createRow()

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `Imagem de ${user.name}`
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user p').innerHTML = `${user.name}`
    row.querySelector('.user span').innerHTML = `${user.login}`
    row.querySelector('.repositories').innerHTML = `${user.public_repos}`
    row.querySelector('.followers').innerHTML = `${user.followers}`
    row.querySelector('.remove').onclick = () => {
      const isOk = confirm('Tem certeza que deseja remover dos favoritos?')

      if (isOk) {
        this.delete(user)
      }
    }
     this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td class="user">
      <img src="https://github.com/amaendoas.png" alt="Imagem de Amanda">
      <a href="https://github.com/amaendoas" target="_blank">
        <p>Amanda Guerra</p>
        <span>/amaeondas</span>
      </a>
    </td>
    <td class="repositories">
      27
    </td>
    <td class="followers">
      14
    </td>
    <td class="remove">
      Remover
    </td>`

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}