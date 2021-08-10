/**
 * @borrows https://github.com/abinavseelan/react-input-trigger/blob/master/src/index.js
 * It doesn't have type definitions. So copied and cnverted to ts
 *
 * @author abinavseelan
 * @link https://github.com/abinavseelan
 */

import React, { Component } from 'react';
import { hookType, Result, Trigger } from 'src/utils/types';
import getCaretCoordinates from 'textarea-caret';

interface Props {
  trigger?: Trigger;
  onStart?(obj: Result): void;
  onCancel?(obj: Result): void;
  onType?(obj: Result): void;
  endTrigger?(resetState: () => void): void;
  elementRef?: HTMLTextAreaElement | null;
}

interface State {
  triggered: boolean;
  triggerStartPosition: number;
}

function getHookObject(type: hookType, element: HTMLTextAreaElement, startPoint?: number) {
  const caret = getCaretCoordinates(element, element.selectionEnd);

  const result: Result = {
    hookType: type,
    cursor: {
      selectionStart: element.selectionStart,
      selectionEnd: element.selectionEnd,
      top: caret.top,
      left: caret.left,
      height: caret.height,
    },
  };

  if (!startPoint) {
    return result;
  }

  result.text = element.value.substr(startPoint, element.selectionStart);

  return result;
}

export default class InputTrigger extends Component<Props, State> {
  public static defaultProps = {
    trigger: {
      keyCode: null,
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
    },
    onStart: () => {},
    onCancel: () => {},
    onType: () => {},
    endTrigger: () => {},
    elementRef: null,
  };

  constructor(args: Props) {
    super(args);

    this.state = {
      triggered: false,
      triggerStartPosition: null as any,
    };

    this.handleTrigger = this.handleTrigger.bind(this);
    this.resetState = this.resetState.bind(this);
    //@ts-ignore
    this.element = this.props.elementRef;
  }

  componentDidMount() {
    this.props.endTrigger!(this.resetState);
  }

  element: HTMLTextAreaElement;

  handleTrigger(event: React.KeyboardEvent<HTMLDivElement>) {
    const { trigger, onStart, onCancel, onType } = this.props;

    const { which, shiftKey, metaKey, ctrlKey } = event;

    //@ts-ignore
    const { selectionStart } = event.target;
    const { triggered, triggerStartPosition } = this.state;

    if (!triggered) {
      if (
        which === trigger?.keyCode &&
        shiftKey === !!trigger?.shiftKey &&
        ctrlKey === !!trigger?.ctrlKey &&
        metaKey === !!trigger?.metaKey
      ) {
        this.setState(
          {
            triggered: true,
            triggerStartPosition: selectionStart + 1,
          },
          () => {
            setTimeout(() => {
              onStart!(getHookObject('start', this.element));
            }, 0);
          },
        );
        return null;
      }
    } else {
      if (which === 8 && selectionStart <= triggerStartPosition) {
        this.setState(
          {
            triggered: false,
            triggerStartPosition: null as any,
          },
          () => {
            setTimeout(() => {
              onCancel!(getHookObject('cancel', this.element));
            }, 0);
          },
        );

        return null;
      }

      setTimeout(() => {
        onType!(getHookObject('typing', this.element, triggerStartPosition));
      }, 0);
    }

    return null;
  }

  resetState() {
    this.setState({
      triggered: false,
      triggerStartPosition: null as any,
    });
  }

  render() {
    const { elementRef, children, trigger, onStart, onCancel, onType, endTrigger, ...rest } =
      this.props;

    return (
      <div
        className="w-full h-full"
        role="textbox"
        tabIndex={-1}
        onKeyDown={this.handleTrigger}
        {...rest}
      >
        {!elementRef
          ? React.Children.map(this.props.children, (child) =>
              React.cloneElement(child as React.ReactElement, {
                ref: (element: HTMLTextAreaElement) => {
                  this.element = element;
                  //@ts-ignore
                  if (typeof child!.ref === 'function') {
                    //@ts-ignore
                    child.ref(element);
                  }
                },
              }),
            )
          : children}
      </div>
    );
  }
}
