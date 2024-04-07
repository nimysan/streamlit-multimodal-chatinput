import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ChangeEvent, ReactNode, useState } from "react"
import Switch from '@mui/material/Switch';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import { Box, Container } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';

// interface Image {
//   url: string;
// }

interface State {
  prompt: string
  isFocused: boolean,
  fileDataURLs: string[]
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  }
];
/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class MultiModalInputComponent extends StreamlitComponentBase<State> {

  public state = { prompt: "your message", isFocused: false, imageList: [], fileDataURLs: [] }
  // const [searchText: any, setSearchText: any] = useState('');

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const name = this.props.args["name"]

    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    let rv = React.version


    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const { theme } = this.props
    const style: React.CSSProperties = {}

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `1px solid ${this.state.isFocused ? theme.primaryColor : "gray"
        }`
      style.border = borderStyling
      style.outline = borderStyling
    }

    const styles = {
      section: {
        fontFamily: "-apple-system",
        fontSize: "1rem",
        fontWeight: 1.5,
        lineHeight: 1.5,
        color: "#292b2c",
        backgroundColor: "#fff",
        padding: "0 2em"
      },
      wrapper: {
        textAlign: "center",
        maxWidth: "950px",
        margin: "0 auto",
        border: "1px solid #e6e6e6",
        padding: "40px 25px",
        marginTop: "50px"
      },
      avatar: {
        margin: "-90px auto 30px",
        width: "100px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "0"
      },
      quote: {
        lineHeight: 1.5,
        fontWeight: 300,
        marginBottom: "25px",
        fontSize: "1.375rem"
      },
      name: {
        marginBottom: "0",
        fontWeight: 600,
        fontSize: "1rem"
      },
      position: { fontWeight: 400 },
      preview: {
        width: 100,
        height: 100,
        margin: 10,
        border: "1px red solid"
      }
    };

    // const [file, setFile] = useState(null);
    // const [fileDataURL, setFileDataURL] = useState(null);
    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      <span>
        <Container maxWidth="sm">

          <label htmlFor='image'> {rv}  </label> -
          {/* <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar> */}
          <label htmlFor='image'> Browse images </label>
          {/* <p>{JSON.stringify(this.state)}</p> */}
          <input type="file" multiple onChange={(e) => this.onImageUploaded(e)} aria-label="你好" />
          {/* <img src={this.state.fileDataURL} alt="preview" style={styles.preview} /> */}
          <ImageList sx={{ width: 500, minHeight: 40 }} cols={3} rowHeight={164}>
            {this.state.fileDataURLs.map((item) => (
              <img src={item} alt="preview" style={styles.preview} />
            ))}
          </ImageList>
          {/* {this.state.fileDataURLs.map((item) => (
            <img src={item} alt="preview" style={styles.preview} />
          ))} */}
          {/* <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar> */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }} >
            <TextField id="input-with-sx" label="Your Message" variant="standard" fullWidth onKeyDown={this.handleKeyDown} />
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          </Box>
        </Container>
      </span>
    )
  }

  /** Click handler for our "Click Me!" button. */
  private onClicked = (): void => {
    // Increment state.numClicks, and pass the new value back to
    // Streamlit via `Streamlit.setComponentValue`.
    this.setState(
      prevState => ({ prompt: prevState.prompt + "" }),
      () => Streamlit.setComponentValue(this.state.fileDataURLs)
    )
  }
  private handleKeyDown = (event: {
    target: any; key: string;
  }) => {
    debugger
    if (event.key === 'Enter') {
      // Perform your desired action when the user presses Enter
      const val = event.target.value;
      this.setState(
        () => ({ prompt: val }),
        () => Streamlit.setComponentValue(this.state)
      )
    }
  };

  private onImageUploaded = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64Contents = await Promise.all(files.map(this.convertToBase64));

    this.setState(
      (prevState) => ({
        fileDataURLs: [...prevState.fileDataURLs, ...base64Contents],
      }),
      () => Streamlit.setComponentValue({ fileDataURLs: this.state.fileDataURLs })
    );
  };

  private convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  /** Focus handler for our "Click Me!" button. */
  private _onFocus = (): void => {
    this.setState({ isFocused: true })
  }

  /** Blur handler for our "Click Me!" button. */
  private _onBlur = (): void => {
    this.setState({ isFocused: false })
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(MultiModalInputComponent)
