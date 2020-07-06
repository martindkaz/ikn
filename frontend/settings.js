import {useState} from 'react';
import {useWatchable, useGlobalConfig, useBase, useRecords, useViewMetadata} from '@airtable/blocks/ui';

import * as tf from '@tensorflow/tfjs';
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { UMAP } from 'umap-js';

import cosineSimilarity from './cosineSimilarity.js';
import sortObjectByValues from './sortObjectByValues.js';


/**
 */
export default function useLatestDrawableData(userContextString, numOfTopNodes) {
   
    //
    async function loadUSElite(){
        setUSEliteRequested(true);
        const model = await use.load();

        setModelUSElite(model);
        setUSEliteReady(true);
        
    }
    
    //
    async function initializeNodeEmbedHiDim(){
    
        setNodeEmbedHiDimRequested(true);
        let textArr = Object.entries(nodesData).map(a => a[1]['text4NLP']);

        const embedTemp = await mUSElite.embed(textArr);       
        
        setNodeEmbedHiDim(embedTemp.arraySync());
        setNodeEmbedHiDimReady(true);
    } 

    //
    async function projectHiDimTo2D(){

        setHiDimTo2Drequested(true);    
        const umap = new UMAP({
            nComponents: 2,
            nEpochs: 100,
            nNeighbors: 5,
          });
        const coordTemp = umap.fit(nodeEmbedHiDim);
        setNodeEmbed2D(coordTemp);
        setHiDimTo2Dready(true);
    }
 
    //
    function getNodesData(){
        let nodesSet = {};
        records.forEach(record => {
            // gather all text from fields for NLP (multiline & singleline fields)
            let cummText = "";
            viewMetadata.visibleFields.forEach(field => {
                if ((field.type == "multilineText") || (field.type == "singleLineText")) {
                    cummText = cummText + " / " + record.getCellValueAsString(field.name);
                }
            });
            let gNode = {
                name: record.name.substring(0,17) + '...',
                text4NLP: cummText,
                tooltipLabel: cummText
            }
            nodesSet[record.id] = gNode;
        });
        return nodesSet;
    }

    //
    function initNodeCoord(){
        let coordSet ={};
        let i = 0;
        records.forEach(record => {
            coordSet[record.id] = nodeEmbed2D[i];
            i = i + 1;
        });
        setNodeCoord(coordSet);
        setInitializedNodeCoord(true);
    }

    function pushToOrInitializeArray(obj, key, value) {
        if (!obj[key]) {
            obj[key] = [];
        } else if (!Array.isArray(obj[key])) {
            throw new Error(`Expected an array at ${key}, but found ${obj[key]}`);
        }
        obj[key].push(value);
    }

    //
    async function initLinkData(){
        let linksSet ={};
        let linksParAndChiByNode = {};
        let queryResult;
        for (var i = 0; i < records.length; i++) {
            queryResult = records[i].selectLinkedRecordsFromCell(linkField);
            await queryResult.loadDataAsync();
            queryResult.recordIds.forEach(linkedID => {
                linksSet[`${records[i].id}_${linkedID}`] = {
                    id: `${records[i].id}_${linkedID}`,
                    source: records[i].id,
                    destin: linkedID,
                    thick: 0.1
                };
                pushToOrInitializeArray(
                    linksParAndChiByNode,
                    records[i].id,
                    `${records[i].id}_${linkedID}`
                );
                pushToOrInitializeArray(
                    linksParAndChiByNode,
                    linkedID,
                    `${records[i].id}_${linkedID}`
                );
            });
            queryResult.unloadData();
        }

        setLinkData(linksSet);
        setLinksParAndChiByNode(linksParAndChiByNode);
        setInitializedLinkData(true);
    }

    //
    function initNLUnodeSizes(){
        let nluNSset = {};
        for (var i = 0; i < records.length; i++) {
            nluNSset[records[i].id] = 3;
        }
        return nluNSset;
    }
    function initNLUnodeSizes2(){
        setLastContextString(userContextString);
        let nluNSset = {};
        for (var i = 0; i < records.length; i++) {
            nluNSset[records[i].id] = 3;
        }
        setNLUnodeSizes(nluNSset);
        setTopFilteredNodes(Object.keys(nodesData));
    }


    //
    function initNLUlinkThick(){
        let nluLTset = {};
        linkData.forEach(link => {
            nluLTset[link['id']] = 1;
        });
        
        setNLUlinkThick(nluLTset);
    }

    //
    function updateTopFilteredNodes(nodeSet){
        let allSorted = sortObjectByValues(nodeSet);
        let topSlice = [];
        for (var i = 0; i < numOfTopNodes; i++){
            topSlice[i] = allSorted[i][0];
        }
        setTopFilteredNodes(topSlice);
    }

    //
    async function updateNLUrelevances(){
        setLastContextString(userContextString);
        setLastNumOfTopNodes(numOfTopNodes);
        const userCSembedTensor = await mUSElite.embed(userContextString);
        const userCSembed = userCSembedTensor.arraySync();

        const MAX_NODE_SIZE = 30;
        let cosSim;
        let nluNSset = {};
        for (var i = 0; i < records.length; i++) {
            cosSim = cosineSimilarity(userCSembed[0], nodeEmbedHiDim[i]);
            nluNSset[records[i].id] = MAX_NODE_SIZE * cosSim;
        }

        setNLUnodeSizes(nluNSset);
        updateTopFilteredNodes(nluNSset);

    }

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const viewId = globalConfig.get('selectedViewId');
    const linkFieldId = globalConfig.get('selectedlinkFieldId');

    const uBase = useBase();
    const table = uBase.getTableByIdIfExists(tableId);
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const viewMetadata = useViewMetadata(view);

    const linkField = table ? table.getFieldByIdIfExists(linkFieldId) : null;

    const queryResult = view.selectRecords();
    const records = useRecords(queryResult);

    const [nodesData, setNodesData] = useState(() => getNodesData());
    const [topFilteredNodes, setTopFilteredNodes] = useState(() => Object.keys(nodesData));
    
    const [USEliteRequested, setUSEliteRequested] = useState(false);
    const [mUSElite, setModelUSElite] = useState();
    const [USEliteReady, setUSEliteReady] = useState(false);
    
    if (!USEliteRequested) loadUSElite();

    const [nodeEmbedHiDimRequested, setNodeEmbedHiDimRequested] = useState(false);
    const [nodeEmbedHiDim, setNodeEmbedHiDim] = useState();
    const [nodeEmbedHiDimReady, setNodeEmbedHiDimReady] = useState(false);

    if (USEliteReady && !nodeEmbedHiDimRequested) {
        initializeNodeEmbedHiDim();
    }

    const [hiDimTo2Drequested, setHiDimTo2Drequested] = useState(false);
    const [nodeEmbed2D, setNodeEmbed2D] = useState();
    const [hiDimTo2Dready, setHiDimTo2Dready] = useState(false);

    if (nodeEmbedHiDimReady && !hiDimTo2Drequested) {
        projectHiDimTo2D();
    }

    // need the 2D embedings into a key:coord format
    // init only when hiDimTo2Dready
    const [initializedNodeCoord, setInitializedNodeCoord] = useState(false);
    const [nodeCoord, setNodeCoord] = useState();

    if (hiDimTo2Dready && !initializedNodeCoord) {
        initNodeCoord();
    }

    const [initializedLinkData, setInitializedLinkData] = useState(false);
    const [linksParAndChiByNode, setLinksParAndChiByNode] = useState();
    const [linkData, setLinkData] = useState();
    const [nluLinkThick, setNLUlinkThick] = useState();

    if (!initializedLinkData) {
        initLinkData();
    }

    // const [initializedNLUnodeSizes, setInitializedNLUnodeSizes] = useState(false);
    const [nluNodeSizes, setNLUnodeSizes] = useState(() => initNLUnodeSizes());

    // if (initializedLinkData){
    //     initNLUlinkThick();     
    // }

    let haveDrawableData = false;
    if (initializedLinkData && initializedNodeCoord) haveDrawableData=true;

    const [lastContextString, setLastContextString] = useState('');
    const [lastNumOfTopNodes, setLastNumOfTopNodes] = useState(0);

    // update NLU relevances/weights: adjust node size & link thickness
    if (nodeEmbedHiDimReady && (userContextString != lastContextString)) {
        if (userContextString == '') {
            initNLUnodeSizes2();
        } else {
            updateNLUrelevances();
        }
    }

    if (haveDrawableData && numOfTopNodes != lastNumOfTopNodes) {
        updateNLUrelevances();
    }

    useWatchable(queryResult, ['cellValues'], () => {
        setNodesData(getNodesData());
        setNodeEmbedHiDimRequested(false);
        setNodeEmbedHiDimReady(false);
        setHiDimTo2Drequested(false);
        setHiDimTo2Dready(false);
        setInitializedNodeCoord(false);
        setInitializedLinkData(false);
        updateNLUrelevances();
    });

    return {
        records,
        nodesData,
        nodeCoord,
        linkData,
        linksParAndChiByNode,
        nluNodeSizes,
        topFilteredNodes,
        haveDrawableData
    };
}
