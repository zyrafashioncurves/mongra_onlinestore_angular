import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService, TreeNode } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { ProductService } from '@/pages/products/product.service';
import { ColorService } from '@/pages/service/color.service';
import { Addproductservice } from './addproductservice';
import { FitService } from '@/pages/service/fit.service';
import { PatternService } from '@/pages/service/pattern.service';
import { SeasonService } from '@/pages/service/season.service';
import { OccasionService } from '@/pages/service/occation.service';

@Component({
  selector: 'app-addproduct',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    TableModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule, FileUploadModule, GalleriaModule,
    Tooltip, DialogModule],
  templateUrl: './addproduct.html',
  styleUrl: './addproduct.scss'
})
export class Addproduct implements OnInit {
  showeErrorSuggestion: boolean = false;
  showeErrorSuggestionSize: boolean = false;
  showeErrorSuggestionFile: boolean = false;
  uploadedFiles: File[] = [];
  displayConfirmation: boolean = false;
  autoValue: any[] | undefined;
  
  category:any[] | undefined;
  styleCategory:any[] | undefined;
  subCategory:any[] | undefined;
  genderCategory:any[] | undefined;
  autoFilteredValue: any[] = [];
  autoFilteredCategoryValue: any[] = [];
  
  loading: boolean = true;
  maxFilesize:any;

  autoFabricTypeValue: any[] | undefined;
autoFilteredFabricTypeValue: any[] = [];
autoWorkTypeValue: any[] | undefined;
autoFilteredWorkTypeValue: any[] = [];
  hasInvalidSizes(): boolean {
    if (this.product.sizes === null || this.product.sizes.length === 0) return false;
    return this.product.sizes.some((size: any) =>
      !size.size ||
      size.price == null || size.price === '' ||
      size.quantity == null || size.quantity === '' ||
      size.discountPercentage == null || size.discountPercentage === ''
    );
  }


  onSubmit(form: NgForm) {
    console.log("Button Clicked")
    if (form.invalid || this.product.sizes.length === 0 || this.hasInvalidSizes() || this.uploadedFiles === null || this.uploadedFiles.length === 0) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields including valid sizes.'
      });
      if (form.invalid) {
        this.showeErrorSuggestion = true;
      }
      if (this.hasInvalidSizes()) {
        this.showeErrorSuggestionSize = true;
      }
      if (this.uploadedFiles === null || this.uploadedFiles.length === 0) {
        this.showeErrorSuggestionFile = true;
      }

      return;
    }

    this.openConfirmation();
  }


  
  colorService = inject(ColorService);
  closeConfirmation() {
    this.displayConfirmation = false;
  }
  openConfirmation() {
    this.displayConfirmation = true;
  }

  product: any = {
    name: '',
    description: '',
    category: '',
    isFeatured: false,
    rating:3,
    variantName:'',
    variantDescription:'',
    color: '',
    sizes: [],  // start with empty table
  madeBy: ''
  };

  removeSize(size: any) {
    this.product.sizes = this.product.sizes.filter((s: any) => s !== size);
  }
  addSize() {
    const newSize = {
      id: null, // temp ID until backend assigns
      size: '',
      price: 0,
      quantity: 0,
      discountPercentage: 0,
      sku: '',
      hsnCode: '',
      inventoryStatus: 'IN_STOCK'
    };
    this.product.sizes.push(newSize);
  }

  constructor(private route: ActivatedRoute, private productService: ProductService, private addProductService: Addproductservice,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.maxFilesize=1000000;
    this.loading = true;
    this.getColor();
    this.getcategory();
    this.loading = false;
  }
  
  getColor() {
    this.colorService.getColors().then((colors) => {
      this.autoValue = colors;
    });
  }
  


  getcategory() {
    this.addProductService.getCategory().subscribe({
      next: (res: any) => {
        this.category = res;
        console.log(this.category);
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'unable to get Category'
        });
      }
    });

  }
 
 

  filterItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoValue as any[]).length; i++) {
      const item = (this.autoValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredValue = filtered;
  }

  
  
  

  

  filterCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.category as any[]).length; i++) {
      const item = (this.category as any[])[i];
      if (item.category.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredCategoryValue = filtered;
  }

  
  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }
  onFileSelect(event: any) {
    
    for (const file of event.files) {
      
      if(! (file.size > this.maxFilesize)){
       
      this.uploadedFiles.push(file);
       this.messageService.add({ key: 'global', severity: 'info', summary: 'Success!', detail: file.name+' selected',sticky:true });
      }else{
        this.messageService.add({ key: 'global', severity: 'warn', summary: 'Too Large!', detail: file.name+' not selected',sticky:true });
      }
    }
    console.log("==", this.uploadedFiles)
   
  }
  onFileRemove(event: any) {
    const fileToRemove = event.file;
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileToRemove);
    console.log("==", this.uploadedFiles)
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'File removed' });
  }
  onClearFiles() {
    this.uploadedFiles = [];
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'Removed all files' });
    console.log("==", this.uploadedFiles)
  }
  saveProduct() {
    this.displayConfirmation = false;

    // Build request JSON
    const metadata = {
      name: this.product.name,
      description: this.product.description,
      category: this.product.category.category,
      
      rating:this.product.rating,
      isFeatured: this.product.isFeatured,
      color: this.product.color.name,
      sizes: this.product.sizes,
      variantName:this.product.variantName,
      variantDescription:this.product.variantDescription,

      
  madeBy: this.product.madeBy
      
    };

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));
    this.uploadedFiles.forEach(file => formData.append('file', file, file.name));

    console.log('FormData Metadata:', metadata);
    console.log('Files:', this.uploadedFiles);

    this.productService.upload(formData).subscribe({
      next: (res: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Success!',
          sticky: true,
          detail: res.message || 'New product has been added successfully'
        });
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          sticky: true,
          detail: err.error?.message || 'Failed to add new product'
        });
      }
    });
  }
}
