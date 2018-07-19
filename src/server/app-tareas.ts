"use strict";

import {ProceduresTareas} from "./procedures-tareas";

// tslint:disable TS6133
import * as pgPromise from "pg-promise-strict";
// tslint:disable-next-line:TS6133.
import * as express from "express";
import { AppBackend } from "backend-plus";
import * as bp from "backend-plus";


export type Constructor<T> = new(...args: any[]) => T;

export function emergeAppTareas<T extends Constructor<AppBackend>>(Base:T){
    
    return class AppTareas extends Base{
        constructor(...args:any[]){ 
            super(...args);
        }
        getProcedures(){
            var be = this;
            return super.getProcedures().then(function(procedures){
                return procedures.concat(
                    ProceduresTareas.map(be.procedureDefCompleter, be)
                );
            });
        }
        clientIncludes(req:bp.Request, hideBEPlusInclusions:boolean){
            return super.clientIncludes(req, hideBEPlusInclusions).concat([
                {type:'js' , src:'client/offline.js', ts:'src/client'}
            ])
        }
        getMenu():bp.MenuDefinition{
            let myMenuPart:bp.MenuInfo[]=[
                {menuType:'table', name:'objetivos', showInOfflineMode: true},
                {menuType:'table', name:'usuarios', showInOfflineMode: true },
                { menuType: 'menu', name: 'menu_visible_offline', showInOfflineMode: true, menuContent: [
                    { menuType: 'table', name: 'objetivos', label: 'no_visible_offline' },
                    { menuType: 'table', name: 'objetivos', showInOfflineMode: true, label: 'visible_offline' },
                    { menuType: 'table', name: 'objetivos', label: 'no_visible_offline' },
                ] },
                { menuType: 'menu', name: 'menu_no_visible_offline', menuContent: [
                    { menuType: 'table', name: 'objetivos', label: 'no_visible_offline'  },
                    { menuType: 'table', name: 'objetivos' , label: 'no_visible_offline' },
                ] },
            ];
            let menu = {menu: super.getMenu().menu.concat(myMenuPart)}
            return menu;
        }
        getTables(){
            return [
                'usuarios',
                'estados',
                'objetivos',
                'tareas',
                'detalles',
            ]
        }
    }
}