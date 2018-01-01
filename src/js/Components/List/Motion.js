import React from "react"
import { Motion, spring } from "react-motion"
import Styled from "styled-components"

import { reinsert, clamp } from "./../../helpers/"
const springConfig = { stiffness: 300, damping: 50, precision: 0.05 }

const ListContainer = Styled.div`
  position: relative;
  ${props => (props.rowWidth ? "width:" + props.rowWidth + "px;" : null)}
  width: ${props => props.rowWidth}px;
  height: ${props => props.listHeight}px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
`

const ListItem = Styled.div`
  cursor: pointer;
  width: 100%;
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  height: ${props => props.rowHeight}px;
`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0
    }
  }

  componentDidMount() {
    window.addEventListener("touchmove", this.handleTouchMove)
    window.addEventListener("touchend", this.handleMouseUp)
    window.addEventListener("mousemove", this.handleMouseMove)
    window.addEventListener("mouseup", this.handleMouseUp)
  }

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0])
  }

  handleTouchMove = e => {
    e.preventDefault()
    this.handleMouseMove(e.touches[0])
  }

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos
    })
  }

  handleMouseMove = ({ pageY }) => {
    const { isPressed, topDeltaY, originalPosOfLastPressed } = this.state
    const { onReOrder } = this.props
    const order = this.getOrder()

    if (isPressed) {
      const mouseY = pageY - topDeltaY
      const currentRow = clamp(
        Math.round(mouseY / (1.1 * this.props.rowHeight)),
        0,
        this.getChildren().length - 1
      )
      let newOrder = order

      if (currentRow !== order.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(
          order,
          order.indexOf(originalPosOfLastPressed),
          currentRow
        )
        onReOrder ? onReOrder(newOrder) : null
      }

      this.setState({ mouseY: mouseY })
    }
  }

  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 })
  }

  getOrder = () => {
    const { order } = this.props
    return order ? order : this.getChildren().map((child, idx) => idx)
  }

  getChildren = () => {
    const { children } = this.props

    if (!children) {
      return []
    } else if (!children.length) {
      return [children]
    } else {
      return children
    }
  }

  render() {
    const { mouseY, isPressed, originalPosOfLastPressed } = this.state

    const { rowHeight, rowWidth } = this.props

    return (
      <ListContainer
        rowWidth={rowWidth}
        listHeight={rowHeight * 1.1 * this.getChildren().length}
      >
        {this.getChildren().map((child, i) => {
          const style =
            originalPosOfLastPressed === i && isPressed
              ? {
                  scale: spring(1, springConfig),
                  y: mouseY
                }
              : {
                  scale: spring(1, springConfig),
                  y: spring(
                    this.getOrder().indexOf(i) * (1.1 * rowHeight),
                    springConfig
                  )
                }
          return (
            <Motion style={style} key={i}>
              {({ scale, y }) => (
                <ListItem
                  onMouseDown={this.handleMouseDown.bind(null, i, y)}
                  onTouchStart={this.handleTouchStart.bind(null, i, y)}
                  rowHeight={rowHeight}
                  style={{
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    zIndex: i === originalPosOfLastPressed ? 100 : i
                  }}
                >
                  {child}
                </ListItem>
              )}
            </Motion>
          )
        })}
      </ListContainer>
    )
  }
}
