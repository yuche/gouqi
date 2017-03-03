import * as React from 'react'
import {
  Animated,
  ScrollView,
  ActivityIndicator
 } from 'react-native'
interface IState {
  scrollY: Animated.Value
}

class ParallaxScroll extends React.Component<any, IState> {

  static HEADER_HEIGHT = 160

  public static defaultProps: any = {
    renderScrollComponent: (props: any) => <ScrollView {...props} />
  }

  private scrollComponent: any

  constructor(props: any) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  /*
   * Expose `ScrollView` API so this component is composable with any component that expects a `ScrollView`.
   * see: https://github.com/exponent/react-native-scrollable-mixin
   */
  getScrollResponder() {
    return this.scrollComponent.getScrollResponder()
  }

  setNativeProps(props: any) {
    this.scrollComponent.setNativeProps(props)
  }

  getScrollableNode() {
    return this.getScrollResponder().getScrollableNode()
  }
  getInnerViewNode() {
    return this.getScrollResponder().getInnerViewNode()
  }
  scrollTo(...args: any[]) {
    this.getScrollResponder().scrollTo(...args)
  }

  render() {
    const {
      children,
      renderScrollComponent,
      isLoading,
      ...scrollViewProps
    } = this.props

    const {
      scrollY
    } = this.state

    const bodyComponent = this.renderBodyComponent(scrollY, isLoading, children)

    return React.cloneElement(
      renderScrollComponent(scrollViewProps), {
        ref: component => { this.scrollComponent = component },
        onScroll: this.onScroll,
        scrollEventThrottle: 16
      },
      bodyComponent
    )
  }

  onScroll = (event: any) => {
    const {
      onScroll: prevOnScroll = (e: any) => ({})
    } = this.props

    const { nativeEvent: { contentOffset: { y: offsetY } } } = event

    this.state.scrollY.setValue(offsetY)

    // it's import that NOT overwrite original ListView methods
    prevOnScroll(event)
  }

  renderBodyComponent (scrollY: Animated.Value, isLoading: boolean, children: any) {
    const MARGIN_TOP = ParallaxScroll.HEADER_HEIGHT

    const playlistY = scrollY.interpolate({
      inputRange: [0, MARGIN_TOP, MARGIN_TOP],
      outputRange: [0, MARGIN_TOP, MARGIN_TOP]
    })

    return (
      <Animated.View style={{transform: [{ translateY :playlistY }], paddingBottom: MARGIN_TOP}}>
        {children}
        {isLoading && <ActivityIndicator animating style={{marginTop: 15}}/>}
      </Animated.View>
    )
  }

}

export default ParallaxScroll

