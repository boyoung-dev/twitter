import React, { useEffect, useState } from 'react';
import {dbService} from 'fbase';
import Nweet from '../components/Nweet'

const Home = ({userObj}) => {

    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);

    const getNweets = async () => {
        const dbNweets = await dbService.collection('nweets').get();

        dbNweets.forEach(document => {
            const nweetOb = {
                ...document.data(),
                id: document.id,
            }
            setNweets(prev => [nweetOb, ...prev]);
        })
    }

    useEffect(() => {
        dbService.collection('nweets').onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {

        event.preventDefault();
        await dbService.collection("nweets").add({
            nweet: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });

        setNweet('');
    }

    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    };

    return <div>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} value={nweet} type='text' placeholder="What's on your mind?" maxLength={120}/>
            <input type='submit' value='Nweet'/>
        </form>

        <div>
            {nweets.map(nweet => <>
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
            </>)}
        </div>
    </div>
}
export default Home