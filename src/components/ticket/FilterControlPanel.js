import { useState } from "react";
import { environment } from "../../environment/environment.dev";
import { basicAuth } from "../../types/basicAuth";
import { parserEvento } from "../../types/parsers";
import { Combobox } from "../ui/combobox/Combobox";
import { Buffer } from 'buffer';
import axios from "axios";

const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectoresByEvento = environment.UrlGetSectoresByEvento;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const FilterControlPanel = ({selectedEvento, setSelectedEvento, selectedSector, setSelectedSector}) => {
    const [ sectores, setSectores ] = useState([]);

    const fetchSectoresByEvento = async (id) => {
        try {
            let response = await axios.get(UrlGetSectoresByEvento + `${id}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });
            const {data} = response.data;
            setSectores(data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeEvento = async ({target}) => {
        setSelectedEvento(target.value);
        if (target.value != '0')
            await fetchSectoresByEvento(target.value);
    }

    const handleChangeSector = ({target}) => {
        setSelectedSector(target.value);
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-3">
                    <label>Evento</label>
                    <Combobox
                        id="selectedEvento"
                        name="selectedEvento"
                        value={selectedEvento}
                        setValue={handleChangeEvento}
                        url={UrlGetEventos}
                        parser={parserEvento}
                        tipoAuth={environment.BasicAuthType}
                    /> 
                </div>

                <div className="col-lg-4">
                    <label>Sector</label>
                    {
                        selectedEvento == 0 ? "" :
                        <select id="selectedSector" value={selectedSector} onChange={handleChangeSector} className='custom-select form-control'>
                            <option value="0">---Seleccione---</option>
                            { sectores.map((sector) => (
                                <option key={sector.idSector} value={sector.idSector}>{sector.nombreSector}</option>
                            )) }
                        </select>
                    }
                </div>
            </div>
        </>
    );
}
