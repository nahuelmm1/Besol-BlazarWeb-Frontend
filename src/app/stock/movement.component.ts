import { Component, OnInit } from '@angular/core';
import { DropDownEditorRender } from './ag-component/dropdown-editor-render';

@Component({
  moduleId: module.id,
  templateUrl: 'movement.component.html',
})

export class MovementComponent implements OnInit {
  loading: boolean = false;
  title = 'app';
  columnDefs = [];
  rowData = [{Marca: 'Marca 1', Articulo: 'Art 1', Talle: 'Talle 1', Color: 'Color 1'}];
  frameworkComponents;
  defaultColDef;
  gridApi;
  gridColumnApi;

  constructor() {
    this.columnDefs = [
      {
        field: 'Marca',
        cellEditor: 'dropDownEditorRender',
        cellEditorParams: {
          values: [{id: 1, name: 'Marca 1'},{id: 2, name: 'Marca 2'},{id: 3, name: 'Marca 3'}]
        }
      },
      {
        field: 'Articulo',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
          cellHeight: 50,
          values: [{id: 1, name: 'Art 1'},{id: 2, name: 'Art 2'},{id: 3, name: 'Art 3'}]
        }
      },
      {
        field: 'Talle'
      },
      {
        field: 'Color'
      }
    ];

    this.frameworkComponents =  { dropDownEditorRender: DropDownEditorRender }

    this.defaultColDef = {
      editable: true,
      resizable: true
    };
  }

  onCellValueChanged(params) {
    // var colId = params.column.getId();
    // if (colId === "country") {
    //   var selectedCountry = params.data.country;
    //   var selectedCity = params.data.city;
    //   var allowedCities = countyToCityMap(selectedCountry);
    //   var cityMismatch = allowedCities.indexOf(selectedCity) < 0;
    //   if (cityMismatch) {
    //     params.node.setDataValue("city", null);
    //   }
    // }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    //this.gridApi.columnDefs['Marca'].cellEditorParams =  [{id: 1, name: 'Marca 3'},{id: 2, name: 'Marca 4'},{id: 3, name: 'Marca 4'}];
  }

  ngOnInit(): void {
    
    
  }

}
