import React from 'react';

class DimensionsProvider extends React.Component {
  state = {
    containerWidth: window.innerWidth, // Default to full window width
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      containerWidth: window.innerWidth, // Update width on resize
    });
  };

  render() {
    // We don't pass containerHeight because the piano height is fixed.
    return this.props.children({ containerWidth: this.state.containerWidth });
  }
}

export default DimensionsProvider;

