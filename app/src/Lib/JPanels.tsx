import React, { Children, cloneElement, HTMLProps, PropsWithChildren, useMemo } from 'react';
import { classNames, typeValidation } from 'src/utils/helpers';
import JButton from './JButton';

export enum ElementTypes {
  JPanel = 'JPanel',
  JTabs = 'JTabs',
}

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'selected'> {
  children: React.ReactNode;
  selected: string;
}

export const JPanels: React.FC<Props> = ({ children, selected, ...rest }) => {
  function getPanels() {
    return Children.map(children, (child) => {
      if (!React.isValidElement(child)) return null;

      if (
        child.props.__TYPE === ElementTypes.JPanel &&
        child.props.children &&
        typeof child.props.children === 'object'
      )
        return child.props.children;
    })?.filter((x) => !!x);
  }

  const panels = useMemo(getPanels, [children]);

  function renderTab() {
    return panels?.map((panel) => {
      if (!panel.props.id) throw new Error('no id prop found');
      const { id } = panel.props;
      if (id === selected) return panel;
      return null;
    });
  }

  const memoizedPanel = useMemo(renderTab, [children, selected]);

  function getTabs() {
    return Children.map(children, (child) => {
      if (!React.isValidElement(child)) return null;

      if (child.props.__TYPE === ElementTypes.JTabs)
        return cloneElement<PropsWithChildren<JTabsProps>>(child, { ...child.props });
    })?.filter((x) => !!x)[0];
  }

  const tabs = useMemo(getTabs, [children]);

  return (
    <div {...rest}>
      {/* render tabs */}
      <div className="bg-warm-gray-200 rounded-md flex items-center" role="tablist">
        {!!tabs?.props.children
          ? tabs.props.children
          : tabs?.props.tabs?.map((tab, i) => {
              return (
                <JButton
                  key={i}
                  label={
                    !tabs.props.noLabel ? (typeof tab === 'string' ? tab : tab.label) : undefined
                  }
                  noBg
                  icon={typeof tab === 'string' ? undefined : tab.icon}
                  className={classNames([
                    'self-stretch hover:(bg-warm-gray-300 rounded-md) flex-grow',
                    (typeof tab === 'string' ? tab : tab.label) === selected
                      ? `${tabs?.props.activeClass || '!bg-warm-gray-300'}`
                      : '',
                  ])}
                  onClick={() =>
                    !!tabs?.props.onClick &&
                    tabs?.props.onClick(typeof tab === 'string' ? tab : tab.label)
                  }
                />
              );
            })}
      </div>

      {/* render panels */}
      <div role="tabpanel" className="pt-2">
        {memoizedPanel}
      </div>
    </div>
  );
};

interface JPanelProps {
  children: React.ReactNode;
  __TYPE?: any;
}

export const JPanel: React.FC<JPanelProps> = ({ children }) => {
  return <div>{children}</div>;
};

JPanel.propTypes = {
  __TYPE: typeValidation(ElementTypes.JPanel),
};

JPanel.defaultProps = { __TYPE: ElementTypes.JPanel };

type TabType = string | { label: string; icon: string };

interface JTabsProps {
  tabs?: TabType[];
  onClick?: (val: string) => void;
  activeClass?: string;
  noLabel?: boolean;
  __TYPE?: any;
}

export const JTabs: React.FC<JTabsProps> = ({ children }) => {
  return <div>{children}</div>;
};

JTabs.propTypes = {
  __TYPE: typeValidation(ElementTypes.JTabs),
};

JTabs.defaultProps = { noLabel: false, __TYPE: ElementTypes.JTabs };
