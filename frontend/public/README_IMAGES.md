# Adding Images to RoomSync

## To Use Your Own Images:

1. **Place your images in the `public` folder:**
   ```
   copilot/public/
   ├── xblock.jpg      # Your X-Block image
   ├── yblock.png      # Your Y-Block image
   └── index.html
   ```

2. **Update BlueprintView.tsx to use your images:**
   
   **For X-Block:**
   ```tsx
   <img 
     src="/xblock.jpg" 
     alt="X-Block Campus Building" 
     className="w-full h-auto rounded-lg shadow-lg"
   />
   ```
   
   **For Y-Block:**
   ```tsx
   <img 
     src="/yblock.png" 
     alt="Y-Block Campus Building" 
     className="w-full h-auto rounded-lg shadow-lg"
   />
   ```

## Current Status:
- ✅ **Beautiful placeholder cards** are now displayed
- ✅ **No broken image links**
- ✅ **Professional appearance** with gradients and icons
- ✅ **Responsive design** that works on all devices

## Image Requirements:
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 600x400 pixels or larger
- **Location**: Must be in the `public` folder
- **Naming**: Must match exactly (case-sensitive)

## Alternative Solutions:
1. **Use your own images** (recommended)
2. **Keep the current beautiful placeholders**
3. **Use online image services** like Unsplash
4. **Create custom SVG graphics**

The current implementation provides a professional, visually appealing solution that will work immediately without any external dependencies!
