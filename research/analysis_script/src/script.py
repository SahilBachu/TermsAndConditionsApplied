# Research analysis script
# This was used to calculate the Flesch-Kincaid grade levels for all the
# privacy policies and homepage marketing text in the dataset.
# The results were used in the research paper to prove the "Transparency Gap"

from pathlib import Path
from typing import Optional, Any
from readability import Readability
from readability.exceptions import ReadabilityException
import nltk
import matplotlib.pyplot as plt


def read_data_file(file_path: Path) -> str:
    """Reads a text file and returns its content."""
    with file_path.open('r', encoding='utf-8') as file:
        content = file.read()
    return content


def flesch_kincaid(text: str) -> Optional[Any]:
    """
    Calculates the Flesch-Kincaid grade level for a given text.
    Returns None if the text is too short or the analysis fails.
    The readability library needs at least 100 words to work properly.
    """
    try:
        r = Readability(text)
        return r.flesch_kincaid()
    except ReadabilityException:
        return None


def analyze_all_files(folder: Path) -> float:
    """
    Goes through every .txt file in a folder, calculates its FK grade,
    and returns the average. This is how we got the 11.7 vs 15.4 numbers
    in the paper.
    """
    number_of_files = 0
    total_flesch_kincaid = 0

    for file_path in folder.glob("*.txt"):
        content = read_data_file(file_path)
        flesch_kincaid_value = flesch_kincaid(content)

        if flesch_kincaid_value:
            number_of_files += 1
            print(f"{file_path} {flesch_kincaid_value}")
            total_flesch_kincaid += int(flesch_kincaid_value.grade_level)

    # Don't divide by zero if no files were found
    if number_of_files == 0:
        return 0.0

    average = total_flesch_kincaid / number_of_files
    print(f"Average\n: {average}")
    return average


def bar_plot(privacy_average: float, marketing_average: float) -> None:
    """Generates the bar chart comparing privacy policy vs marketing FK grades."""
    titles = ["Privacy Policies", "Homepage Marketing"]
    averages = [privacy_average, marketing_average]

    plt.bar(titles, averages)
    plt.title('Average Flesch-Kincaid Grade')
    plt.xlabel('Category')
    plt.ylabel('Average Grade Level')
    plt.show()


def main():
    """Main function - downloads NLTK data if needed, runs the analysis, plots the chart."""

    # NLTK needs these tokenizer packages to split text into sentences/words
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        nltk.download('punkt_tab')

    # Set up folder paths relative to this script's location
    # Goes up two levels from src/ to research/, then into data/
    base_path = Path(__file__).resolve().parent.parent.parent
    privacy_policies_folder = base_path / "data" / "PrivacyPolicies"
    homepage_marketing_folder = base_path / "data" / "HomepageMarketing"

    # Run the analysis on both folders
    print("--- Analyzing Privacy Policies ---")
    privacy_avg = analyze_all_files(privacy_policies_folder)

    print("\n--- Analyzing Homepage Marketing ---")
    homepage_marketing_avg = analyze_all_files(homepage_marketing_folder)

    # Show the comparison chart
    bar_plot(privacy_avg, homepage_marketing_avg)


if __name__ == "__main__":
    main()
