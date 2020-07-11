/** Angular Imports */
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

/** rxjs Imports */
import { of } from 'rxjs';

/** Custom Services */
import { OrganizationService } from '../organization.service';
import { PopoverService } from '../../configuration-wizard/popover/popover.service';
import { ConfigurationWizardService } from '../../configuration-wizard/configuration-wizard.service';

/**
 * Holidays component.
 */
@Component({
  selector: 'mifosx-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit, AfterViewInit {

  /** Office selector. */
  officeSelector = new FormControl();
  /** Holidays data. */
  holidaysData: any;
  /** Offices data. */
  officeData: any;
  /** Columns to be displayed in holidays table. */
  displayedColumns: string[] = ['name', 'fromDate', 'toDate', 'repaymentsRescheduledTo', 'status'];
  /** Data source for holidays table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for holidays table. */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Sorter for holidays table. */
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('buttonCreateHoliday') buttonCreateHoliday: ElementRef<any>;
  @ViewChild('templateButtonCreateHoliday') templateButtonCreateHoliday: TemplateRef<any>;
  @ViewChild('filterRef') filterRef: ElementRef<any>;
  @ViewChild('templateFilterRef') templateFilterRef: TemplateRef<any>;

  /**
   * Retrieves the offices data from `resolve`.
   * @param {OrganizationService} organizationService Organization Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {FormBuilder} formBuilder Form Builder.
   */
  constructor(private organizationService: OrganizationService,
              private route: ActivatedRoute,
              private router: Router,
              private configurationWizardService: ConfigurationWizardService,
              private popoverService: PopoverService) {
    this.route.data.subscribe(( data: { offices: any }) => {
      this.officeData = data.offices;
    });
  }

  /**
   * Filters data in holidays table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Retrieves holidays data on changing office.
   */
  ngOnInit() {
    this.onChangeOffice();
  }

  /**
   * Retrieves the holidays data on changing office and sets the holidays table.
   */
  onChangeOffice() {
    this.officeSelector.valueChanges.subscribe((officeId = this.officeSelector.value) => {
      this.organizationService.getHolidays(officeId).subscribe((holidays: any) => {
        this.holidaysData = holidays.filter((holiday: any) => holiday.status.value !== 'Deleted');
        this.setHolidays();
      });
    });
  }

  /**
   * Initializes the data source, paginator and sorter for holidays table.
   */
  setHolidays() {
    this.dataSource = new MatTableDataSource(this.holidaysData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showPopover(template: TemplateRef<any>, target: HTMLElement | ElementRef<any>, position: string, backdrop: boolean): void {
    setTimeout(() => this.popoverService.open(template, target, position, backdrop, {}), 200);
  }

  ngAfterViewInit() {
    if (this.configurationWizardService.showHolidayPage === true) {
      setTimeout(() => {
          this.showPopover(this.templateButtonCreateHoliday, this.buttonCreateHoliday.nativeElement, 'bottom', true);
      });
    }

    if (this.configurationWizardService.showHolidayFilter === true) {
      setTimeout(() => {
          this.showPopover(this.templateFilterRef, this.filterRef.nativeElement, 'bottom', true);
      });
    }
  }

  nextStep() {
    this.configurationWizardService.showHolidayPage = false;
    this.configurationWizardService.showHolidayFilter = false;
    this.configurationWizardService.showCreateEmployee = true;
    this.router.navigate(['/organization']);
  }

  previousStep() {
    this.configurationWizardService.showHolidayPage = false;
    this.configurationWizardService.showHolidayFilter = false;
    this.configurationWizardService.showCreateHoliday = true;
    this.router.navigate(['/organization']);
  }
}
