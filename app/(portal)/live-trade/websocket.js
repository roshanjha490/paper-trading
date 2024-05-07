import { useEffect, useState } from 'react';
import { get_positions } from '@/app/actions';

const useWebSocket = (instrument_tokens) => {

    const [messages, setMessages] = useState([]);

    const [new_positions, setNewPositions] = useState([]);

    useEffect(() => {
        const fetchPositions = async () => {
            const response = await get_positions();
            setNewPositions(response);

            const newInstrumentTokens = response.map(position => {
                return { instrument_token: position.instrument_token, current_price: 0};
            });

            setMessages(newInstrumentTokens);
        };

        fetchPositions();

    }, []);


    useEffect(() => {

        const fetchData = async () => {

            const socket = new WebSocket('ws://localhost:3001')

            socket.onopen = () => {

                const jsonData = messages.map(message => message.instrument_token);

                socket.send(JSON.stringify(jsonData));

                console.log('Websocket Connection is Established')
            }

            socket.onmessage = (event) => {

                const tick_messages = JSON.parse(event.data)

                setMessages(prevMessages => {
                    const updatedMessages = prevMessages.map((message) => {
                        const correspondingTickData = tick_messages.find(
                            (tick) => tick.instrument_token === message.instrument_token
                        );
                        if (correspondingTickData) {
                            return {
                                ...message,
                                current_price: correspondingTickData.last_price
                            };
                        }
                        return message;
                    });

                    return updatedMessages;
                });

            };

            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

        }

        fetchData()


    }, [new_positions]);

    return messages;
};

export default useWebSocket;