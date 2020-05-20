import React from 'react';
import {Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import Rating from '@material-ui/lab/Rating/Rating';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardContent from '@material-ui/core/CardContent/CardContent';
import CardActions from '@material-ui/core/CardActions/CardActions';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Image from 'material-ui-image';
import red from '@material-ui/core/colors/red';
import Moment from 'react-moment';
import 'moment/locale/ru';

export const pointerIcon = new L.Icon({
    iconUrl: 'assets/MarkerIcon.svg',
    iconRetinaUrl: 'assets/MarkerIcon.svg',
    iconAnchor: [15, 40],
    popupAnchor: [0, -44],
    iconSize: [30, 40],
    shadowUrl: 'assets/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [10, 41],
  })

interface MarkerProps {
    id: number,
    lat: number;
    lng: number;
    title: string;
    description: string;
    rating?: number;
    comment?: {
        author_name: string;
        author_avatar: string;
        date: string;
        text: string;
        rating: number;
    }
}

const useStyles = makeStyles((theme) => ({
    popup: {
        width: 400,
        '& .leaflet-popup-content': {
            width: 'auto !important'
        },
        '& .leaflet-popup-close-button': {
            padding: `${theme.spacing(1,1,0,0)} !important`
        }
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    description: {
        margin: '0 !important',
    },
    moreButton: {
        padding: theme.spacing(1),
    },
    avatar: {
        backgroundColor: red[500],
    },
    cardHeader: {
        paddingRight: 0,
        paddingLeft: 0,
    },
    cardContent: {
        paddingTop: 0,
        paddingBottom: 0,
        '& p': {
            margin: 0,
        },
    }
}))

const LeafletMarker = (props: MarkerProps): JSX.Element => {
    const {
        id,
        lat,
        lng,
        title,
        description,
        rating,
        comment,
    } = props;

    const classes = useStyles();

    return (
        <Marker position={[lat, lng]} icon={pointerIcon}>
            <Popup className={classes.popup}>
                <Grid container spacing={1}>
                    <Grid item className={classes.image}>
                        <Image className={classes.img} src='/assets/old_building.jpg' />
                    </Grid>
                    <Grid item xs container direction='column' spacing={1}>
                        <Grid item xs>
                            <Typography gutterBottom variant='subtitle1'>
                            {title}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' className={classes.description} gutterBottom>
                            {description}
                            </Typography>
                        </Grid>
                        <Grid item container spacing={1} alignItems='center'>
                            <Grid item>
                                <Rating value={rating} precision={0.5} defaultValue={0} readOnly />
                            </Grid>
                            <Grid item>
                                <Button color="secondary" className={classes.moreButton} href={`#/roof/${id}`}>
                                    Подробнее
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                { comment && (
                    <Card elevation={0}>
                        <CardHeader
                            avatar={
                                comment.author_avatar ? (
                                    <Avatar src={comment.author_avatar} />
                                ) : (
                                    <Avatar className={classes.avatar}>
                                        {comment.author_name.split(' ').map((name => name[0].toUpperCase())).join('')}
                                    </Avatar>
                                )
                            }
                            title={comment.author_name}
                            subheader={<Moment locale='ru' fromNow>{comment.date}</Moment>}
                            className={classes.cardHeader}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {comment.text}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Popup>
        </Marker>
    );
}

export default LeafletMarker;