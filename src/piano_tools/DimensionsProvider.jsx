import React from 'react'

class DimensionsProvider extends React.Component {
  state = {
    containerWidth: 0,
    containerHeight: 0,
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    this.setState({
      containerWidth: this.container.offsetWidth,
      containerHeight: this.container.offsetHeight,
    })
  }

  render() {
    return (
      <div ref={(el) => (this.container = el)} style={{ width: '100%', height: '100%' }}>
        {this.props.children(this.state)}
      </div>
    )
  }
}

export default DimensionsProvider

