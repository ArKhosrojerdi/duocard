import React, {useState} from 'react';
import MuiCard from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {connect} from "react-redux";
import type {IWord} from "../../types/Word";
import type {IRootState} from "../../store";
import {Constants} from "../../store/actions";
import axios from "../../axios-cards";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    boxShadow: "0 2px 6px rgba(127, 127, 127, .25)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 24,
  },
  flip: {
    margin: "auto",
    textAlign: "center"
  },
  text: {
    transition: `all .5s ${theme.transitions.easing.easeInOut}`,
  },
  pb0: {
    paddingBottom: theme.spacing(0)
  }
}));

const mapStateToProps = (state: IRootState) => state;

interface IMapActionsToProps {
  setWords: (word: IWord[]) => any;
}

type MyProps = IRootState & IMapActionsToProps & {
  word: IWord;
  removeHandler?: any;
}

function Card(props: MyProps) {
  const classes = useStyles();
  const [side, setSide] = useState(true);
  let lang: string | null = null;
  for (let l of props.languages) {
    if (props.word.lang === l.id) {
      lang = l.name;
      break;
    }
  }

  const removeHandler = (id: number) => {
    const newWords = props.words.filter(word => word.id !== id);

    props.setWords(newWords);
    axios.post('/cards.json', newWords).then().catch(err => {
      throw err;
    });
  }

  return (
    <MuiCard className={classes.root} variant={"outlined"}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {lang}
        </Typography>
        {side ?
          <Typography
            variant="h5"
            component="h2"
          >
            {props.word.text}
          </Typography>
          :
          <Typography
            variant="h5"
            component="h2"
          >
            {props.word.tran}
          </Typography>
        }
        <Typography className={classes.pos} color="textSecondary">
          {props.word.pos}
        </Typography>

        <CardActions className={classes.pb0}>
          <Button
            className={classes.flip}
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setSide(side => !side)
            }}
          >
            Flip
          </Button>

          <Button
            className={classes.flip}
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => {
              removeHandler(props.word.id)
            }}
          >
            Delete
          </Button>
        </CardActions>
      </CardContent>
    </MuiCard>
  );
}

const mapActionsToProps = (dispatch: any) => ({
  removeWord: (id: number) => dispatch({type: Constants.REMOVE_WORD, id: id}),
  setWords: (words: IWord[]) => dispatch({type: Constants.SET_WORDS, payload: words}),
});

export default connect(mapStateToProps, mapActionsToProps)(Card);
