import React from 'react'

import '@/App.css'
import api from '@/services/api'
import Tools from '@/components/Tools'
import Form from '@/components/Form'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tools: [],
      criterio: '',
      tags: false,
      show: false
    }
  }

  componentDidMount() {
    api.getTools()
      .then(tools => {
        this.setState({ tools })
      })
  }

  onCriterioKeyUp = (e) => {
    this.setState({ criterio: e.target.value })
  }

  onTagsClick = () => {
    const tags = !this.state.tags
    this.setState({ tags })
  }

  onNovaClick = () => {
    this.setState({ show: true })
  }

  onAdicionar = (e) => {
    const tags = (e.marcadores || '').split(' ')
    const tool = { ...e, tags }
    delete tool.marcadores
    api.createTool(tool)
      .then(tool => {
        const before = this.state.tools
        const after = [ ...before, tool ]
        this.setState({ tools: after, show: false })
      })
  }

  onRemover = (tool) => {
    api.removeTool(tool.id)
      .then(() => {
        const before = this.state.tools
        const after = before.filter(t => t.id !== tool.id)
        this.setState({ tools: after })
      })
  }

  render () {
    const criterio = this.state.criterio.trim()
    const tags = this.state.tags
    const tools = this.state.tools
      .filter(tool => {
        return criterio === '' ||
          (!tags && tool.title.includes(criterio)) ||
          (tags && tool.tags.some((tag) => tag.includes(criterio)))
      })
    const show = this.state.show
    return (
      <div className='App'>
        <h1>VUTTR</h1>
        <h3>Very Useful Tools to Remember</h3>
        <input
          type='text'
          data-input='criterio'
          onKeyUp={this.onCriterioKeyUp}
        />
        <input
          type='checkbox'
          data-input='tags'
          onClick={this.onTagsClick}
        />
        <button
          action-trigger='nova'
          onClick={this.onNovaClick}
        >Add</button>
        <Tools tools={tools} onRemover={this.onRemover}/>
        <Form show={show} onAdicionar={this.onAdicionar}/>
      </div>
    )
  }
}

