//import { experimentalStyled } from '@material-ui/core/styles';
import { useTheme } from "@material-ui/core";
//const LogoRoot = experimentalStyled('img')``;

const Logo = (props) => {
  const dark = useTheme().palette.mode === 'dark';
  
  return <img
    style={{marginTop: dark ? 10 : undefined, marginRight: dark ? 15 : undefined}}
    width="180"
    src={dark ? '/static/logoRamaiahLight.jpeg' : '/static/logoRamaiah.jpeg'}
    alt="Ramaiah logo"
  >
    
  </img>
}

export default Logo;
