import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Map, TileLayer, ZoomControl} from 'react-leaflet';
import makeStyles from '@material-ui/core/styles/makeStyles';
import 'leaflet/dist/leaflet.css';

import {RootState} from '../../store';
import AppBar from '../shared/app-bar';
import Marker from './marker';
import {getRoofs} from '../../store/actions/roofs';

const useStyles = makeStyles({
    map: {
        height: 'calc(100vh - 64px)',
    },
})

const MapPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        roofs,
        isLoaded,
    } = useSelector((state: RootState) => state.roofs);

    useEffect(() => {
        if (!isLoaded) dispatch(getRoofs());
    }, [isLoaded, dispatch]);

    return (
        <>
            <AppBar />
            <Map center={[56.2890213,43.9543629]} zoom={11} className={classes.map} zoomControl={false}>
                <TileLayer
                    attribution='<a href="http://mapbox.com/">MapBox</a>'
                    accessToken='pk.eyJ1IjoiYWN0aXZlY2hvb24iLCJhIjoiY2thMWNjaXdjMGE0ZDNlbnlncGI0OXpjdSJ9.XuNU341XBdxXZ7_HcXtaOg'
                    url='https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}'
                />
                <ZoomControl position='bottomright' />

                {roofs.map((el: any): JSX.Element => (
                    <Marker
                        id={el.id}
                        lat={el.lat}
                        lng={el.lng}
                        description={el.description}
                        title={el.name}
                        rating={el.rating}
                        key={el.id}
                        imageURL={el.thumbnail}
                        comment={el.comments?.length && el.comments.slice(-1)[0]}
                    />
                ))}
            </Map>
        </>
    )
}

export default MapPage;