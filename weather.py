import json
import time
import sys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options

weather_data = {
    "temperature": 0,
    "city": sys.argv[1],
}

# functions


def clickIt():
    try:
        locationButton = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, 'LocationSearch_listbox-0'))
        )
        locationButton.click()
    except:
        print("locationButt not found!")


# Set up the Chrome browser driver
options = Options()
options.add_experimental_option("detach", True)
options.add_argument(sys.argv[2])
options.add_argument("--profile-directory=Profile 2")
driver = Chrome(options=options)
# Navigate to the website
driver.get("https://weather.com/")
time.sleep(2)
try:
    searchBox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'LocationSearch_input'))
    )
    searchBox.send_keys(weather_data["city"])
    searchBox.send_keys(Keys.END)
except:
    print("searchbox not found!")

while True:
    try:
        element = driver.find_element(By.ID, "LocationSearch_listbox")
        aria = element.get_attribute('aria-label')
        if aria == 'Search Result List':
            clickIt()
            break  # Exit the loop if the condition is met
        else:
            time.sleep(7)
            continue  # Jump back to the beginning of the loop for another iteration
    except:
        print("aria not found!")
        break  # Exit the loop if an exception occurs

try:
    ele = driver.find_element(
        By.CSS_SELECTOR, "span.CurrentConditions--tempValue--MHmYY")
    value = ele.text
    weather_data["temperature"] = value
except:
    print("ele not found")

try:
    location = driver.find_element(
        By.CSS_SELECTOR, ".CurrentConditions--location--1YWj_")
    city = location.text
    weather_data["city"] = city
except:
    print("Location not found")

jsonString = json.dumps(weather_data)
print(jsonString)
time.sleep(2)
