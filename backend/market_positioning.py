import logging
from typing import Dict, Any
from text_model import TextGenerationModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketPositioningAnalyzer:
    def __init__(self, text_model: TextGenerationModel):
        self.text_model = text_model
    
    def analyze_market_positioning(self, startup_idea: str, use_groq: bool = True) -> Dict[str, Any]:
        """
        Analyze market positioning for a startup idea and return structured insights.
        
        Args:
            startup_idea: Description of the startup idea
            use_groq: Whether to use Groq API for faster inference
            
        Returns:
            Dictionary containing market analysis results
        """
        try:
            logger.info("Market positioning analysis started")
            
            # Create structured prompt for market analysis
            prompt = self._create_market_analysis_prompt(startup_idea)
            
            # Generate analysis using text model
            analysis = self.text_model.generate_text(prompt, use_groq, max_length=800)
            
            # Parse and structure the response
            structured_analysis = self._parse_analysis_response(analysis)
            
            logger.info("Market positioning analysis completed")
            
            return {
                "success": True,
                "analysis": structured_analysis,
                "raw_response": analysis
            }
            
        except Exception as e:
            logger.error(f"Error in market positioning analysis: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "analysis": None
            }
    
    def _create_market_analysis_prompt(self, startup_idea: str) -> str:
        """
        Create a structured prompt for market positioning analysis.
        """
        return f"""You are a branding strategist and market analyst. Analyze the market positioning for the following startup idea.

Startup idea:
{startup_idea}

Return the answer in the following sections with clear headings:

Industry:
[Identify the industry and sector]

Top competitors:
[List 3-5 main competitors with brief descriptions]

Market gap:
[Identify what's missing in the current market that this startup could fill]

Recommended brand positioning:
[Provide a clear positioning statement and strategy]

Target audience:
[Describe the primary target demographic and psychographic profile]

Be specific, actionable, and provide insights that would be valuable for strategic planning. Keep each section concise but comprehensive."""
    
    def _parse_analysis_response(self, analysis: str) -> Dict[str, str]:
        """
        Parse the analysis response into structured format.
        """
        sections = {
            "industry": "",
            "top_competitors": "",
            "market_gap": "",
            "recommended_positioning": "",
            "target_audience": ""
        }
        
        # Split by lines and process
        lines = analysis.split('\n')
        current_section = None
        section_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check for section headers
            if line.lower().startswith('industry:'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "industry"
                section_content = [line.replace('Industry:', '', 1).strip()]
            elif line.lower().startswith('top competitors:'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "top_competitors"
                section_content = [line.replace('Top competitors:', '', 1).strip()]
            elif line.lower().startswith('market gap:'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "market_gap"
                section_content = [line.replace('Market gap:', '', 1).strip()]
            elif line.lower().startswith('recommended brand positioning:'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "recommended_positioning"
                section_content = [line.replace('Recommended brand positioning:', '', 1).strip()]
            elif line.lower().startswith('target audience:'):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = "target_audience"
                section_content = [line.replace('Target audience:', '', 1).strip()]
            elif current_section and line:
                section_content.append(line)
        
        # Don't forget the last section
        if current_section:
            sections[current_section] = '\n'.join(section_content).strip()
        
        # If parsing failed, return the raw analysis in the industry field
        if not any(sections.values()):
            sections["industry"] = analysis
        
        return sections
    
    def format_analysis_for_chat(self, analysis_result: Dict[str, Any]) -> str:
        """
        Format the analysis result for display in chat interface.
        """
        if not analysis_result.get("success"):
            return f"I apologize, but I couldn't complete the market analysis: {analysis_result.get('error', 'Unknown error')}"
        
        analysis = analysis_result.get("analysis", {})
        
        formatted_response = "## Market Positioning Analysis\n\n"
        
        if analysis.get("industry"):
            formatted_response += f"**Industry:**\n{analysis['industry']}\n\n"
        
        if analysis.get("top_competitors"):
            formatted_response += f"**Top Competitors:**\n{analysis['top_competitors']}\n\n"
        
        if analysis.get("market_gap"):
            formatted_response += f"**Market Gap:**\n{analysis['market_gap']}\n\n"
        
        if analysis.get("recommended_positioning"):
            formatted_response += f"**Recommended Brand Positioning:**\n{analysis['recommended_positioning']}\n\n"
        
        if analysis.get("target_audience"):
            formatted_response += f"**Target Audience:**\n{analysis['target_audience']}\n\n"
        
        return formatted_response
