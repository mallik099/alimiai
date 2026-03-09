import logging
import re
from typing import Dict, Any
from text_model import TextGenerationModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BrandConsistencyChecker:
    def __init__(self, text_model: TextGenerationModel):
        self.text_model = text_model
    
    def check_brand_consistency(self, brand_name: str, tagline: str, description: str, use_groq: bool = True) -> Dict[str, Any]:
        """
        Check brand consistency across brand name, tagline, and description.
        
        Args:
            brand_name: The brand name
            tagline: The brand tagline
            description: The brand description
            use_groq: Whether to use Groq API for faster inference
            
        Returns:
            Dictionary containing consistency analysis results
        """
        try:
            logger.info("Brand consistency analysis started")
            
            # Create structured prompt for consistency analysis
            prompt = self._create_consistency_analysis_prompt(brand_name, tagline, description)
            
            # Generate analysis using text model
            analysis = self.text_model.generate_text(prompt, use_groq, max_length=800)
            
            # Parse and structure the response
            structured_analysis = self._parse_consistency_response(analysis)
            
            logger.info("Brand consistency analysis completed")
            
            return {
                "success": True,
                "analysis": structured_analysis,
                "raw_response": analysis
            }
            
        except Exception as e:
            logger.error(f"Error in brand consistency analysis: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "analysis": None
            }
    
    def extract_brand_elements(self, message: str) -> Dict[str, str]:
        """
        Extract brand name, tagline, and description from user message.
        
        Args:
            message: User message containing brand elements
            
        Returns:
            Dictionary with extracted brand elements
        """
        elements = {
            "brand_name": "",
            "tagline": "",
            "description": ""
        }
        
        # Try to extract structured information
        message_lower = message.lower()
        
        # Look for brand name patterns
        brand_patterns = [
            r'brand name\s*[:\-]?\s*([^\n]+?)(?=\n|tagline|$)',
            r'name\s*[:\-]?\s*([^\n]+?)(?=\n|tagline|$)',
            r'brand[:\s]*([^\n]+?)(?=\n|tagline|$)'
        ]
        
        for pattern in brand_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                elements["brand_name"] = match.group(1).strip()
                break
        
        # Look for tagline patterns
        tagline_patterns = [
            r'tagline\s*[:\-]?\s*([^\n]+?)(?=\n|description|$)',
            r'slogan\s*[:\-]?\s*([^\n]+?)(?=\n|description|$)',
            r'tagline[:\s]*([^\n]+?)(?=\n|description|$)'
        ]
        
        for pattern in tagline_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                elements["tagline"] = match.group(1).strip()
                break
        
        # Look for description patterns
        description_patterns = [
            r'description\s*[:\-]?\s*([^\n]+?)(?=$)',
            r'desc\s*[:\-]?\s*([^\n]+?)(?=$)',
            r'description[:\s]*([^\n]+?)(?=$)'
        ]
        
        for pattern in description_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                elements["description"] = match.group(1).strip()
                break
        
        return elements
    
    def _create_consistency_analysis_prompt(self, brand_name: str, tagline: str, description: str) -> str:
        """
        Create a structured prompt for brand consistency analysis.
        """
        return f"""You are a professional brand strategist. Evaluate the consistency of the following branding elements.

Brand name:
{brand_name}

Tagline:
{tagline}

Description:
{description}

Return the analysis in the following format:

Brand consistency score out of 10:
[Provide a numerical score from 1-10 with brief justification]

Brand personality traits:
[List 3-5 key personality traits that come across from the branding elements]

Strengths:
[Identify what works well and creates consistency across the brand elements]

Weaknesses:
[Identify inconsistencies or areas that could be improved]

Suggestions for improvement:
[Provide specific, actionable suggestions to improve brand consistency]

Be specific, constructive, and provide insights that would be valuable for strengthening the brand identity."""
    
    def _parse_consistency_response(self, analysis: str) -> Dict[str, str]:
        """
        Parse the consistency analysis response into structured format.
        """
        sections = {
            "consistency_score": "",
            "brand_personality": "",
            "strengths": "",
            "weaknesses": "",
            "suggestions": ""
        }
        
        # Split by lines and process
        lines = analysis.split('\n')
        current_section = None
        section_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check for section headers
            if line.lower().startswith('brand consistency score') or line.lower().startswith('consistency score'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "consistency_score"
                section_content = [line]
            elif line.lower().startswith('brand personality') or line.lower().startswith('personality'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "brand_personality"
                section_content = [line]
            elif line.lower().startswith('strengths'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "strengths"
                section_content = [line]
            elif line.lower().startswith('weaknesses'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "weaknesses"
                section_content = [line]
            elif line.lower().startswith('suggestions') or line.lower().startswith('suggested'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "suggestions"
                section_content = [line]
            elif current_section and line:
                section_content.append(line)
        
        # Don't forget the last section
        if current_section:
            sections[current_section] = '\n'.join(section_content).strip()
        
        # If parsing failed, return the raw analysis in the first section
        if not any(sections.values()):
            sections["consistency_score"] = analysis
        
        return sections
    
    def format_consistency_for_chat(self, analysis_result: Dict[str, Any]) -> str:
        """
        Format the consistency analysis result for display in chat interface.
        """
        if not analysis_result.get("success"):
            return f"I apologize, but I couldn't complete the brand consistency analysis: {analysis_result.get('error', 'Unknown error')}"
        
        analysis = analysis_result.get("analysis", {})
        
        formatted_response = "## Brand Consistency Analysis\n\n"
        
        if analysis.get("consistency_score"):
            formatted_response += f"**{analysis['consistency_score']}**\n\n"
        
        if analysis.get("brand_personality"):
            formatted_response += f"**Brand Personality Traits:**\n{analysis['brand_personality']}\n\n"
        
        if analysis.get("strengths"):
            formatted_response += f"**Strengths:**\n{analysis['strengths']}\n\n"
        
        if analysis.get("weaknesses"):
            formatted_response += f"**Weaknesses:**\n{analysis['weaknesses']}\n\n"
        
        if analysis.get("suggestions"):
            formatted_response += f"**Suggestions for Improvement:**\n{analysis['suggestions']}\n\n"
        
        return formatted_response
