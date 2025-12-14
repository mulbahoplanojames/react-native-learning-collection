declare module "react-native-onboarding-swiper" {
  import { Component } from "react";
  import { TextStyle } from "react-native";

  export interface OnboardingPage {
    backgroundColor?: string;
    image?: React.ReactElement;
    title?: string;
    subtitle?: string;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  export interface OnboardingProps {
    pages: OnboardingPage[];
    onSkip?: () => void;
    onDone?: () => void;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    skipLabel?: string | React.ReactElement;
    nextLabel?: string | React.ReactElement;
    doneLabel?: string | React.ReactElement;
    skipToPage?: number;
    bottomBarHeight?: number;
    bottomBarColor?: string;
    bottomBarHighlight?: boolean;
    controlStatusBar?: boolean;
    showPagination?: boolean;
    flatlistProps?: any;
    SkipButtonComponent?: React.ComponentType<any>;
    NextButtonComponent?: React.ComponentType<any>;
    DoneButtonComponent?: React.ComponentType<any>;
    DotComponent?: React.ComponentType<any>;
    pageIndexCallback?: (pageIndex: number) => void;
    transitionAnimationDuration?: number;
    allowFontScaling?: boolean;
  }

  export default class Onboarding extends Component<OnboardingProps> {}
}
