import { Product } from '@/models/product.model';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { Banner, ProductService } from './product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { CartService } from '../cart/cart.service';
import { MessageService } from 'primeng/api';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ProductResponse } from '@/models/product-response.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { ChipModule } from 'primeng/chip';
import { Signup } from "../auth/signup/signup";
import {  LoginComponent } from "../auth/login";
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-products',
  imports: [CardModule, CommonModule, ButtonModule, FluidModule, TagModule, FormsModule, BadgeModule, CarouselModule,
    ChipModule,AnimateOnScrollModule,AvatarModule,TooltipModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Products implements OnInit {

  @ViewChild('bottle', { static: true })
  productFloat!: ElementRef<HTMLImageElement>;
 showAiAssistant = false;
  userInput = '';
  chatMessages: any[] = [];
banners: Banner[] = [];
  aiSuggestions = [
  '💍 Wedding Guest',
  '🎉 Festive Party',
  '🏢 Office Ethnic Day',
  '🌸 Casual Brunch',
  '🌙 Evening Gala',
  '👗 Daily Elegance'
];

isTyping = false;
  aiTaglines = [
    "Tell me your occasion 💬",
    "Discover your look ✨",
    "What’s your next event? 👗",
    "Style. Smart. Simplified.",
    "Your personal AI stylist 🤖",
    "Let’s find your vibe 💫"
  ];
  aiTagline = this.aiTaglines[0];
  private index = 0;
Math = Math;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];
searchQuery:String='';
selectedChip: any = null;
  products: Product[] = [];
  productResponseDto!:ProductResponse;
  loading: boolean = false;
  isAdmin: boolean = false;
showSignupPanel = false;
isLoggedIn:boolean =false;
showLogin = false;
  page: number = 0;
size: number = 10;
lastPage: boolean = false;
showWearSections = false;
private aiIndex = 0;
  prodLength: any;

  constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,
     private cartService: CartService,
    private messageService: MessageService,private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
this.getBanners();
    this.startTaglineRotation();

if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;}
    
    if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;
    this.productService.getWishlist().subscribe({
    next: (items: any[]) => {
      this.wishlistItems = items;
      this.wishlistVariantIds = new Set(items.map(i => i.variantId));
    },
    error: (err) => {
      console.error('Failed to load wishlist', err);
    }
  });
}
    this.route.queryParams.subscribe(params => {
      this.showWearSections = !params['search'];

    const searchQuery = params['search'];

    if (searchQuery) {
      this.fetchSearchedProducts(searchQuery); // If query param exists, search
    } else {
      this.fetchProducts(); // Else load all products
    }
  });

 const user = this.jwtHelper.getUserDetails();
  console.log('User info:', user);

  const isExpired = this.jwtHelper.isTokenExpired();
  console.log('Token expired:', isExpired);
const roles = this.jwtHelper.getUserRoles();
  if (roles.includes('ROLE_ADMIN')) {
    this.isAdmin=true;
  }
  if(isExpired){
  localStorage.clear();
    sessionStorage.clear();
    this.jwtHelper.logout();
    this.isLoggedIn = false;
  }
  

  }
  getBanners() {
   this.productService.getAllBanners().subscribe({
      next: (data) => (this.banners = data),
      error: (err) => console.error('Failed to load banners:', err)
    });
  }

  startTaglineRotation() {
  setInterval(() => {
    this.aiIndex = (this.aiIndex + 1) % this.aiTaglines.length;
    this.aiTagline = this.aiTaglines[this.aiIndex];
  }, 4000);}
selectChip(chip: any) {
  
  this.selectedChip = chip;
  const style=chip.label;
 this.router.navigate(['/search', style]);
}

// checkDeviceAndAuthStatus() {
//   const isMobileWidth = window.innerWidth <= 768;
//   const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

//   // Basic mobile detection using user agent
//   const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

//   this.showMobileAuthUI = isMobileWidth && isMobileDevice && isLoggedIn;
// }

chips = [
  {
    label: 'Ethnic Wear',
    image: '',
  },
  {
    label: 'Mom&Daughter',
    image: '',
  },
  {
    label: 'Casual Wear',
    image: '',
  },
  
];
navigateTo(link: string): void {
  this.router.navigateByUrl(link);
}
  getFrontImageFromVariant(variant: any): string | null {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl || null;
}

handleLoginSuccess($event:any) {
  this.isLoggedIn = true;
  this.showSignupPanel = false;

  // Refresh the current page
  window.location.reload();
}

  // fetchProducts(): void {
  //   this.loading = true;
  //   this.productService.getAllProducts(0, 10).subscribe({
  //     next: (res) => {
  //       this.productResponseDto=res;
  //       this.products = this.productResponseDto.content;
  //       this.loading = false;
        
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch products:', err);
  //       this.loading = false;
  //        this.messageService.add({
  //         key: 'global',
  //         severity: 'error',
  //         summary: 'Oops!',
  //         detail: 'Failed to fetch the products'
  //       });
  //     }
  //   });

  // }

  fetchProducts(): void {
  if (this.lastPage || this.loading) return;

  this.loading = true;

  this.productService.getAllProducts(this.page, this.size).subscribe({
    next: (res: any) => {
      const newProducts = Array.isArray(res?.content) ? res.content : [];
      
      if (newProducts.length) {
        this.products = [...this.products, ...newProducts];
        this.prodLength=this.products.length;
        this.page++;
      }

      // Check if last page
      this.lastPage = res?.last || newProducts.length < this.size;

      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch products:', err);
      this.loading = false;
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: 'Failed to fetch the products'
      });
    }
  });
}


  fetchSearchedProducts(searchQuery:any): void {
    this.products=[];
    this.loading = true;
    this.productService.getSearchedProducts(searchQuery).subscribe({
      next: (res) => {
        this.productResponseDto = res;
        this.products.push(...res.content);
        this.lastPage = res.last; // comes from Spring Data Page
      this.page++; // increment for next call
      this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.loading = false;
         this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Failed to fetch the products'
        });
      }
    });

  }

  /**
   * Get the first "front" image of the first available variant.
   */
  getFrontImage(product: Product): string {
    if (!product.variants || product.variants.length === 0) {
      return 'assets/no-image.png'; // fallback image
    }

    // Loop through variants → find first front image
    for (let variant of product.variants) {
      if (variant.productImage && variant.productImage.length > 0) {
        const frontImg = variant.productImage.find(img => img.viewType === 'front');
        if (frontImg) {
          return frontImg.imageUrl; // return the front image URL
        }
      }
    }

    return 'assets/no-image.png'; // fallback if no front image found
  }
  onCardClick(product:Product,variant:ProductVariantResponseDto) {
  this.router.navigate(['/product-details',variant.id]);
  this.fetchProducts();
}
  buyNow(product: Product): void {
    console.log('Buying:', product.name);
    // implement navigation to checkout or detail page
  }

  // addToCart(product: Product,variant:ProductVariantResponseDto): void {
  //   //event.stopPropagation();
  //   this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
  //     next: () => {
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'success',
  //         summary: 'Added to cart',
  //         detail: `${product.name} was added successfully.`
  //       });
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'error',
  //         summary: 'Add Failed',
  //         detail: 'Could not add to cart. Please try again.'
  //       });
  //     }
  //   });
    
  // }
  isInWishlist(variant: any): boolean {
  return this.wishlistVariantIds.has(variant.id);
}


  toggleWishlist(variant: any, event: MouseEvent): void {
  event.stopPropagation(); // prevent card click

  if(this.isLoggedIn){
  const variantId = variant.id;

  if (this.isInWishlist(variant)) {
    // If already in wishlist → remove
    this.productService.removeFromWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.delete(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  } else {
    // If not in wishlist → add
    this.productService.addToWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.add(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  }
}else{
  this.showSignupPanel=true;
}
}


toggleSignupPanel() {
  this.showSignupPanel = !this.showSignupPanel;

  // Optional: reset to signup when panel opens
  if (this.showSignupPanel) {
    this.showLogin = false;
  }
}
toggleLogin() {
  this.showLogin = !this.showLogin;
}

editProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
  this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}

deleteProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
 this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}


  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'success';
    }
  }

  getFinalPrice(product: any): number {
  if (
    product.variants &&
    product.variants.length > 0 &&
    product.variants[0].sizes &&
    product.variants[0].sizes.length > 0
  ) {
    const size = product.variants[0].sizes[0];
    if (size.discountPercentage > 0) {
      return size.price - (size.price * size.discountPercentage) / 100;
    }
    return size.price;
  }
  return 0;
}
getDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 5); // e.g., 5 days from now
  return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

getSavings(product: any): string {
  const size = product.variants[0].sizes[0];
  if (size.discountPercentage > 0) {
    const savings = Math.round(size.price * size.discountPercentage / 100);
    return `Save ₹${savings} (${size.discountPercentage}% OFF)`;
  }
  return '';
}
getOriginalPrice(product: any): number {
  return product.variants?.[0]?.sizes?.[0]?.price ?? 0;
}

hasDiscount(product: any): boolean {
  return !!product.variants?.[0]?.sizes?.[0]?.discountPercentage;
}


  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];





getVariantFrontImage(variant: any): string {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl || 'assets/placeholder.jpg';
}

getVariantFinalPrice(variant: any): number {
  const size = variant?.sizes?.[0];
  if (!size) return 0;
  return size.price - (size.price * (size.discountPercentage ?? 0)) / 100;
}

getVariantSavings(variant: any): string {
  const size = variant?.sizes?.[0];
  if (!size || !size.discountPercentage) return '';
  const discountAmount = (size.price * size.discountPercentage) / 100;
  return `Save ₹${discountAmount.toFixed(0)}`;
}

getBestSize(variant: any) {
  if (!variant?.sizes?.length) return null;
  return variant.sizes.reduce((prev:any, curr:any) =>
    curr.price < prev.price ? curr : prev
  );
}

getRating(variant: any) {
  return variant.rating;
  
}

offers = [
  {
    title: '🎉 New Arrivals Just Dropped!',
    subtitle: 'Check out our latest festive collection.',
    image: 'assets/banners/new-arrivals.jpg',
    cta: 'Shop Now',
    link: '/collections/new'
  },
  {
    title: '🚚 Free Shipping on Orders Above ₹999',
    subtitle: 'Limited time offer. Don’t miss out!',
    image: 'assets/banners/free-shipping.jpg',
    cta: 'Grab Offer',
    link: '/shipping-info'
  },
  {
    title: '🔥 Grab best Off on Ethnic Wear',
    subtitle: 'Offer ends soon!',
    image: 'assets/banners/ethnic-sale.jpg',
    cta: 'Use Code',
    link: '/collections/ethnic'
  }
];


// getWearType(wearType:any){
// this.productService.getWearType(wearType).subscribe({
//       next: (res) => {
//         this.productResponseDto = res;
//         this.products.push(...res.content);
//         this.lastPage = res.last; // comes from Spring Data Page
//       this.page++; // increment for next call
//       this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to fetch products:', err);
//         this.loading = false;
//          this.messageService.add({
//           key: 'global',
//           severity: 'error',
//           summary: 'Oops!',
//           detail: 'Failed to fetch the products'
//         });
//       }
//     });
// }

getWearType(style:any){
  this.router.navigate(['/search', style]);
}




toggleAiAssistant() {
    this.showAiAssistant = !this.showAiAssistant;
  }
autoGrow(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // set height based on content
}

  sendMessage() {
  if (!this.userInput.trim()) return;
  const query = this.userInput;
  this.chatMessages.push({ text: query, sender: 'user' });
  this.userInput = '';

  // show "typing" indicator
  this.isTyping = true;

  // Call backend
  this.productService.getRecommendations(query).subscribe({
    next: (response) => {
      this.isTyping = false;

      // Display AI message
      this.chatMessages.push({
        text: `Here are some outfit ideas perfect for "${query}":`,
        sender: 'bot'
      });

      // You can show product info nicely
      response.products.forEach((p) => {
        this.chatMessages.push({
          text: `${p.name} (${p.color})\nCategory: ${p.category} / ${p.subCategory}\nImage: ${p.images[0] ?? 'No image'}`,
          sender: 'bot'
        });
      });
    },
    error: (err:any) => {
      this.isTyping = false;
      this.chatMessages.push({
        text: `Sorry, could not get suggestions. Please try again.`,
        sender: 'bot'
      });
      console.error(err);
    }
  });
}

selectSuggestion(text: string) {
  this.userInput = text;
  this.sendMessage();
}



reviews = [
    {
      text: 'I feel lighter and calmer every morning. Mongra has become my daily ritual.',
      name: 'Ananya',
      location: 'Bangalore'
    },
    {
      text: 'No harsh detox effects. Just calm digestion and better sleep.',
      name: 'Rahul',
      location: 'Mumbai'
    },
    {
      text: 'Finally a natural detox I can trust and use daily.',
      name: 'Meera',
      location: 'Chennai'
    },
    {
      text: 'Simple, clean and effective. I love how gentle it feels.',
      name: 'Sneha',
      location: 'Hyderabad'
    }
  ];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 }
  ];

  featuredVariants() {
  return this.products
    ?.flatMap(p => p.variants || [])
    .filter(v =>  v.isFeatured);
}
}
