import os
import torch
from diffusers import AutoPipelineForText2Image
from PIL import Image
import uuid
import time
from typing import Optional, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImageGenerationModel:
    def __init__(self):
        # Dynamic device detection
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipeline = None
        self.model_id = "stabilityai/sd-turbo"  # Better performance for design tasks
        self.static_dir = "static"
        self.is_loaded = False
        
        # Create static directory if it doesn't exist
        os.makedirs(self.static_dir, exist_ok=True)
        
        logger.info(f"Image generation initialized with device: {self.device}")
        logger.info(f"Using model: {self.model_id}")
        
        # Log GPU info if available
        if torch.cuda.is_available():
            gpu_count = torch.cuda.device_count()
            current_gpu = torch.cuda.current_device()
            gpu_name = torch.cuda.get_device_name(current_gpu)
            logger.info(f"GPU detected: {gpu_name} (Device {current_gpu}, Total GPUs: {gpu_count})")
        else:
            logger.info("No CUDA GPU detected, using CPU for image generation")
    
    def load_model(self):
        """Load the Stable Diffusion model with GPU optimizations"""
        if self.is_loaded:
            return True
        
        try:
            logger.info("Loading image generation model...")
            logger.info(f"Loading model: {self.model_id}")
            
            # Set torch dtype based on device
            torch_dtype = torch.float16 if self.device == "cuda" else torch.float32
            
            # Load with optimizations for GPU
            self.pipeline = AutoPipelineForText2Image.from_pretrained(
                self.model_id,
                torch_dtype=torch_dtype,
                safety_checker=None,
                requires_aesthetics_score=False
            )
            
            if self.device == "cuda":
                # Enable memory efficient attention for RTX 3050 and similar GPUs
                self.pipeline.enable_attention_slicing()
                
                # Use xformers if available for better performance
                try:
                    self.pipeline.enable_xformers_memory_efficient_attention()
                    logger.info("XFormers memory efficient attention enabled")
                except Exception as e:
                    logger.warning(f"XFormers not available: {str(e)}")
                    logger.info("Continuing without XFormers optimization")
                
                logger.info("GPU optimizations enabled: attention slicing + XFormers (if available)")
            
            # Move pipeline to the selected device
            self.pipeline = self.pipeline.to(self.device)
            
            self.is_loaded = True
            logger.info(f"Model loaded successfully on {self.device}")
            logger.info(f"Model: {self.model_id} ready for generation")
            
            # Log memory info if using GPU
            if self.device == "cuda":
                if torch.cuda.is_available():
                    memory_allocated = torch.cuda.memory_allocated() / 1024**3  # GB
                    memory_reserved = torch.cuda.memory_reserved() / 1024**3  # GB
                    logger.info(f"GPU Memory - Allocated: {memory_allocated:.2f}GB, Reserved: {memory_reserved:.2f}GB")
            
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False
    
    def is_ready(self) -> bool:
        """Check if the model is ready for generation"""
        return self.is_loaded
    
    def generate_logo(self, prompt: str, brand_name: str = "", style: str = "modern") -> Dict[str, Any]:
        """
        Generate a logo using Stable Diffusion with GPU acceleration
        """
        if not self.load_model():
            return {
                "success": False,
                "error": "Failed to load image generation model"
            }
        
        try:
            # Create an optimized prompt for logo generation
            optimized_prompt = self._create_logo_prompt(prompt, brand_name, style)
            
            logger.info(f"Generating logo with prompt: {optimized_prompt}")
            logger.info(f"Using device: {self.device}")
            
            # Set generation parameters based on device for better quality
            generation_params = {
                "num_inference_steps": 30 if self.device == "cuda" else 25,  # More steps for better quality
                "guidance_scale": 8,  # Slightly higher for better adherence
                "height": 512,
                "width": 512,
                "num_images_per_prompt": 3,  # Generate multiple options
                "generator": torch.Generator(device=self.device).manual_seed(42) if self.device == "cuda" else torch.Generator().manual_seed(42)
            }
            
            # Generate image with device-specific optimizations
            with torch.autocast(self.device, enabled=self.device == "cuda"):
                result = self.pipeline(optimized_prompt, **generation_params)
            
            # Handle multiple images and select the best one
            images = result.images
            best_image = images[0]  # AutoPipelineForText2Image returns best first
            
            # Save the best generated image
            filename = f"logo_{uuid.uuid4().hex[:8]}_{int(time.time())}.png"
            filepath = os.path.join(self.static_dir, filename)
            best_image.save(filepath)
            
            logger.info(f"Generated {len(images)} logo options, selected best image: {filename}")
            
            return {
                "success": True,
                "filename": filename,
                "filepath": filepath,
                "image_url": f"/static/{filename}",
                "prompt_used": optimized_prompt,
                "device_used": self.device,
                "num_generated": len(images),
                "model_used": self.model_id
            }
            
        except Exception as e:
            logger.error(f"Error generating logo: {str(e)}")
            return {
                "success": False,
                "error": f"Error generating logo: {str(e)}"
            }
    
    def generate_brand_image(self, prompt: str, brand_name: str = "", style: str = "professional") -> Dict[str, Any]:
        """
        Generate a brand image using Stable Diffusion with GPU acceleration
        
        Args:
            prompt: User's original request
            brand_name: Name of the brand (if provided)
            style: Style preference
        
        Returns:
            Dictionary with generation results
        """
        if not self.load_model():
            return {
                "success": False,
                "error": "Failed to load image generation model"
            }
        
        try:
            # Create an optimized prompt for brand image generation
            optimized_prompt = self._create_brand_image_prompt(prompt, brand_name, style)
            
            logger.info(f"Generating brand image with prompt: {optimized_prompt}")
            logger.info(f"Using device: {self.device}")
            
            # Set generation parameters based on device
            generation_params = {
                "num_inference_steps": 20 if self.device == "cuda" else 15,
                "guidance_scale": 7.5,
                "height": 512,
                "width": 512,
                "generator": torch.Generator(device=self.device).manual_seed(42) if self.device == "cuda" else torch.Generator().manual_seed(42)
            }
            
            # Generate image with device-specific optimizations
            with torch.autocast(self.device, enabled=self.device == "cuda"):
                result = self.pipeline(optimized_prompt, **generation_params)
            
            # Save the generated image
            image = result.images[0]
            filename = f"brand_image_{uuid.uuid4().hex[:8]}_{int(time.time())}.png"
            filepath = os.path.join(self.static_dir, filename)
            image.save(filepath)
            
            logger.info(f"Brand image generated and saved: {filename}")
            
            return {
                "success": True,
                "filename": filename,
                "filepath": filepath,
                "image_url": f"/static/{filename}",
                "prompt_used": optimized_prompt,
                "device_used": self.device
            }
            
        except Exception as e:
            logger.error(f"Error generating brand image: {str(e)}")
            return {
                "success": False,
                "error": f"Error generating brand image: {str(e)}"
            }
    
    def _create_logo_prompt(self, user_prompt: str, brand_name: str = "", style: str = "modern") -> str:
        """Create an optimized prompt for logo generation with better branding focus"""
        base_prompt = f"minimalist vector logo for {brand_name}" if brand_name else "minimalist vector logo"
        
        # Add style-specific modifiers
        style_modifiers = {
            "modern": "flat design, modern startup branding, clean geometric shapes, simple icon symbol",
            "classic": "elegant, timeless design, professional typography, classic branding",
            "minimalist": "simple, clean, minimalist design, essential elements only",
            "bold": "strong, impactful design, bold typography, high contrast",
            "playful": "creative, fun, vibrant colors, dynamic shapes"
        }
        
        if style.lower() in style_modifiers:
            base_prompt += f", {style_modifiers[style.lower()]}"
        
        # Add industry-specific optimizations from user prompt
        user_terms = user_prompt.lower()
        if any(term in user_terms for term in ["tech", "technology", "software", "app", "digital"]):
            base_prompt += ", tech company, digital design, modern tech aesthetic"
        elif any(term in user_terms for term in ["fitness", "health", "wellness", "sport"]):
            base_prompt += ", fitness brand, active lifestyle, health industry"
        elif any(term in user_terms for term in ["food", "restaurant", "culinary"]):
            base_prompt += ", food industry, culinary branding"
        elif any(term in user_terms for term in ["fashion", "clothing", "style"]):
            base_prompt += ", fashion brand, apparel industry, style"
        
        # Add quality and composition specifications
        base_prompt += ", centered composition, white background, high contrast, vector style graphic"
        
        # Add negative prompt for cleaner results
        negative_prompt = "blurry, distorted text, watermark, photorealistic, 3d render, complex background, shadows, low quality, multiple colors, gradient"
        
        return base_prompt
    
    def _create_brand_image_prompt(self, user_prompt: str, brand_name: str = "", style: str = "professional") -> str:
        """Create an optimized prompt for brand image generation"""
        base_prompt = "professional brand image, corporate photography, high quality"
        
        if brand_name:
            base_prompt += f", branding for {brand_name}"
        
        # Add style modifiers
        style_modifiers = {
            "professional": "corporate, business, clean aesthetic",
            "creative": "artistic, innovative, colorful",
            "minimalist": "simple, clean, modern design",
            "luxury": "premium, elegant, sophisticated"
        }
        
        if style.lower() in style_modifiers:
            base_prompt += f", {style_modifiers[style.lower()]}"
        
        # Add user-specific elements
        if user_prompt:
            user_terms = user_prompt.lower()
            if "office" in user_terms:
                base_prompt += ", modern office space, professional environment"
            elif "product" in user_terms:
                base_prompt += ", product photography, clean background"
            elif "team" in user_terms:
                base_prompt += ", team collaboration, professional workspace"
        
        # Add quality specifications
        base_prompt += ", sharp focus, good lighting, professional photography"
        
        return base_prompt
    
    def cleanup_old_images(self, max_age_hours: int = 24):
        """Clean up old generated images to save disk space"""
        try:
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for filename in os.listdir(self.static_dir):
                if filename.endswith(('.png', '.jpg', '.jpeg')):
                    filepath = os.path.join(self.static_dir, filename)
                    file_age = current_time - os.path.getctime(filepath)
                    
                    if file_age > max_age_seconds:
                        os.remove(filepath)
                        logger.info(f"Removed old image: {filename}")
                        
        except Exception as e:
            logger.error(f"Error cleaning up old images: {str(e)}")
