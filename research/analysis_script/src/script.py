# Necessary imports to find the files and calculate the Flesch-Kincaid grade
from pathlib import Path
from typing import Optional, Any
from readability import Readability
from readability.exceptions import ReadabilityException
import nltk
import matplotlib.pyplot as plt

def read_data_file(file_path: Path) -> str:
    """
    Reads a file and returns its content as a string.

    Args:
        file_path (Path): The path object pointing to the file.

    Returns:
        str: The content of the file decoded in utf-8.
    """
    with file_path.open('r', encoding='utf-8') as file:
        content = file.read()
    return content

def flesch_kincaid(text: str) -> Optional[Any]:
    """
    Uses the readability library to calculate the Flesch-Kincaid grade.

    Args:
        text (str): The text content to analyze.

    Returns:
        Optional[Any]: A readability score object containing the grade_level 
                       if successful, or None if the text is too short/invalid.
    """
    try:
        r = Readability(text)
        return r.flesch_kincaid()
    except ReadabilityException:
        # Return None if the text is too short or analysis fails
        return None

def analyze_all_files(folder: Path) -> float:
    """
    Iterates through all .txt files in a directory to calculate their 
    Flesch-Kincaid grade and returns the average grade for the folder.

    Args:
        folder (Path): The directory path containing the text files.

    Returns:
        float: The average Flesch-Kincaid grade level for the files in the folder.
               Returns 0.0 if no valid files are found.
    """
    number_of_files = 0
    total_flesch_kincaid = 0
    
    # Iterate through all .txt files in the provided folder
    for file_path in folder.glob("*.txt"):
        content = read_data_file(file_path)
        flesch_kincaid_value = flesch_kincaid(content)
        
        if flesch_kincaid_value:
            number_of_files += 1
            print(f"{file_path} {flesch_kincaid_value}")
            # Ensure we capture the grade level as an integer for the sum
            total_flesch_kincaid += int(flesch_kincaid_value.grade_level)
    
    # Prevent division by zero if no files were analyzed
    if number_of_files == 0:
        return 0.0

    average = total_flesch_kincaid / number_of_files
    print(f"Average\n: {average}")
    return average

def bar_plot(privacy_average: float, marketing_average: float) -> None:
    """
    Generates and displays a bar chart comparing privacy and marketing scores.

    Args:
        privacy_average (float): The average grade level for privacy policies.
        marketing_average (float): The average grade level for marketing text.
    """
    titles = ["Privacy Policies", "Homepage Marketing"]
    averages = [privacy_average, marketing_average]
    
    plt.bar(titles, averages)
    plt.title('Average Flesch-Kincaid Grade')
    plt.xlabel('Category')
    plt.ylabel('Average Grade Level')
    plt.show()

def main():
    """
    Main execution function. Sets up dependencies, defines paths, 
    runs analysis, and visualizes results.
    """
    # Installing required dependencies if not already installed
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        nltk.download('punkt_tab')

    # Assigning the folder paths relative to this script
    base_path = Path(__file__).resolve().parent.parent.parent
    privacy_policies_folder = base_path / "data" / "PrivacyPolicies"
    homepage_marketing_folder = base_path / "data" / "HomepageMarketing"

    # Analyzing all files
    print("--- Analyzing Privacy Policies ---")
    privacy_avg = analyze_all_files(privacy_policies_folder)
    
    print("\n--- Analyzing Homepage Marketing ---")
    homepage_marketing_avg = analyze_all_files(homepage_marketing_folder)
    
    # Generate the comparison chart
    bar_plot(privacy_avg, homepage_marketing_avg)

if __name__ == "__main__":
    main()