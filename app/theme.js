import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.pinkA200,
    primary2Color: Colors.pinkA200,
    primary3Color: Colors.pinkA200,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA200,
    accent3Color: Colors.pinkA200,
    textColor: Colors.pinkA200,
    alternateTextColor: Colors.pinkA200,
    canvasColor: Colors.pinkA200,
    borderColor: Colors.pinkA200,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.pinkA200,
  }
};
