import React from 'react'

class DimensionsProvider extends React.Component {
  state = {
    containerWidth: 0,
    containerHeight: 0,
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
    // Adding a delayed update to handle URL bar visibility changes
    setTimeout(this.updateDimensions, 300)  // Adjust delay as needed
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions = () => {
    const isMobile = window.innerWidth < 768 // Consider adjusting based on your breakpoints
    const width = isMobile ? window.innerWidth : this.container.offsetWidth
    const height = this.container.offsetHeight

    this.setState({
      containerWidth: width,
      containerHeight: height,
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

