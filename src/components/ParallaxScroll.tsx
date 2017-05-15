import * as React from 'react'
import {
  Animated,
  ScrollView
 } from 'react-native'
interface IState {
  scrollY: Animated.Value
}

class ParallaxScroll extends React.Component<any, IState> {

  public static defaultProps: any = {
    renderScrollComponent: (props: any) => <ScrollView {...props} />,
    headerHeight: 180
  }

  private scrollComponent: any

  private translateY: any

  constructor (props: any) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }
    const { headerHeight } = this.props
    this.translateY = this.state.scrollY.interpolate({
      inputRange: [0, headerHeight, headerHeight],
      outputRange: [0, headerHeight, headerHeight]
    })
  }

  /*
   * Expose `ScrollView` API so this component is composable with any component that expects a `ScrollView`.
   * see: https://github.com/exponent/react-native-scrollable-mixin
   */
  getScrollResponder () {
    return this.scrollComponent.getScrollResponder()
  }

  setNativeProps (props: any) {
    this.scrollComponent.setNativeProps(props)
  }

  getScrollableNode () {
    return this.getScrollResponder().getScrollableNode()
  }
  getInnerViewNode () {
    return this.getScrollResponder().getInnerViewNode()
  }
  scrollTo (...args: any[]) {
    this.getScrollResponder().scrollTo(...args)
  }

  render () {
    const {
      children,
      renderScrollComponent,
      onScroll,
      ...scrollViewProps
    } = this.props

    const {
      scrollY
    } = this.state

    const bodyComponent = this.renderBodyComponent(children)

    return React.cloneElement(
      renderScrollComponent(scrollViewProps), {
        ref: (component) => { this.scrollComponent = component },
        onScroll: Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            { listener: onScroll }
          ),
        scrollEventThrottle: 16
      },
      bodyComponent
    )
  }

  renderBodyComponent (children: any) {
    const { headerHeight } = this.props

    return (
      <Animated.View style={{transform: [{ translateY: this.translateY }], paddingBottom: headerHeight + 60}}>
        {children}
      </Animated.View>
    )
  }

}

export default ParallaxScroll
