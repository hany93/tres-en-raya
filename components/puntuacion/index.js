import React, { useState, useEffect } from "react";
import { Typography, Button, List, Avatar, Tooltip } from 'antd';
import { useRouter } from "next/router";
import { UserOutlined, HomeFilled, ReloadOutlined } from '@ant-design/icons';

//const ContainerHeight = 400;

const Puntuacion = () => {
    const router = useRouter();

    const [jugadoresRanking, setJugadoresRanking] = useState();

    const irInicio = () => {
        router.push("/");
    }

    const irJuego = () => {
        router.push("/juego");
    }

    useEffect(() => {
        if (!jugadoresRanking) {
            var objJugadorRanking = localStorage.getItem('objJugadorRanking')
            if (objJugadorRanking) {
                objJugadorRanking = JSON.parse(objJugadorRanking)
                objJugadorRanking.sort((a, b) => b.ranking - a.ranking)
            } else {
                objJugadorRanking = []
            }
            setJugadoresRanking(objJugadorRanking)
        }
    });

    return (
        <>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: 'column',
                width: '100%',
                justifyContent: "space-around",
                gap: 12,
                alignItems: 'center'
            }}>
                <Typography.Title level={1} style={{ marginTop: 50, textAlign: 'center' }}><span style={{ color: 'greenyellow' }}>Ranking</span></Typography.Title>
                <List
                    style={{ marginTop: 50, borderColor: '#1e2c33', borderRadius: 4, borderWidth: 3, width: '100vh' }}
                    bordered
                    pagination={{
                        className: "pagination-puntuacion",
                        pageSize: 3,
                        size: 'small'
                    }}
                    itemLayout="horizontal"
                    dataSource={jugadoresRanking}
                    renderItem={item => (
                        <List.Item style={{ borderColor: 'greenyellow' }}>
                            <List.Item.Meta
                                avatar={<Avatar size={50} style={{ color: 'orangered', backgroundColor: 'greenyellow' }} icon={<UserOutlined />} />}
                                title={<div><Typography.Title level={4} style={{ color: 'greenyellow' }}>{item.nombre}</Typography.Title></div>}
                                description={<div><Typography.Title level={5} style={{ color: 'orangered' }}>{item.ranking} Punto{item.ranking > 1 ? 's' : ''}</Typography.Title><Typography.Title level={5} style={{ color: 'orangered' }}>{item.partidas} Partida{item.partidas > 1 ? 's' : ''}</Typography.Title></div>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }} className="button-tablero-siguiente" >
                <Tooltip placement="right" color={'greenyellow'} title={<Typography.Title level={5} style={{ color: '#1e2c33' }}>Jugar otra partida</Typography.Title>}>
                    <Button onClick={() => irJuego()} shape='circle' icon={<ReloadOutlined style={{ fontSize: 20 }} />} />
                </Tooltip>
                <Tooltip placement="right" color='greenyellow' title={<Typography.Title level={5} style={{ color: '#1e2c33' }}>Ir a Inicio</Typography.Title>}>
                    <Button onClick={() => irInicio()} shape='circle' icon={<HomeFilled style={{ fontSize: 20 }} />} />
                </Tooltip>
            </div>
        </>
    );
};

export default Puntuacion;