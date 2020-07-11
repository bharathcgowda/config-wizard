/** Angular Imports */
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { PopoverService } from '../../configuration-wizard/popover/popover.service';
import { ConfigurationWizardService } from '../../configuration-wizard/configuration-wizard.service';

@Component({
  selector: 'mifosx-share-products',
  templateUrl: './share-products.component.html',
  styleUrls: ['./share-products.component.scss']
})
export class ShareProductsComponent implements OnInit, AfterViewInit {

  shareProductsData: any;
  displayedColumns: string[] = ['name', 'shortName', 'totalShares'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('buttonCreateShareProduct') buttonCreateShareProduct: ElementRef<any>;
  @ViewChild('templateButtonCreateShareProduct') templateButtonCreateShareProduct: TemplateRef<any>;
  @ViewChild('shareProductsTable') shareProductsTable: ElementRef<any>;
  @ViewChild('templateShareProductsTable') templateShareProductsTable: TemplateRef<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private configurationWizardService: ConfigurationWizardService,
              private popoverService: PopoverService) {
    this.route.data.subscribe((data: { shareProducts: any }) => {
      this.shareProductsData = data.shareProducts.pageItems;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.shareProductsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    if (this.configurationWizardService.showShareProductsPage === true) {
      setTimeout(() => {
        this.showPopover(this.templateButtonCreateShareProduct, this.buttonCreateShareProduct.nativeElement, 'bottom', true);
      });
    }

    if (this.configurationWizardService.showShareProductsList === true) {
      setTimeout(() => {
        this.showPopover(this.templateShareProductsTable, this.shareProductsTable.nativeElement, 'top', true);
      });
    }
  }

  showPopover(template: TemplateRef<any>, target: HTMLElement | ElementRef<any>, position: string, backdrop: boolean): void {
    setTimeout(() => this.popoverService.open(template, target, position, backdrop, {}), 200);
  }

  nextStep() {
    this.configurationWizardService.showShareProductsPage = false;
    this.configurationWizardService.showShareProductsList = false;
    this.configurationWizardService.showFixedDepositProducts = true;
    this.router.navigate(['/products']);
  }

  previousStep() {
    this.configurationWizardService.showShareProductsPage = false;
    this.configurationWizardService.showShareProductsList = false;
    this.configurationWizardService.showShareProducts = true;
    this.router.navigate(['/products']);
  }

}