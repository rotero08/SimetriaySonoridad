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
    // Use viewport width on mobile devices to ensure it doesn't exceed screen size
    const isMobile = window.innerWidth < 768 // Example breakpoint for mobile devices
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
