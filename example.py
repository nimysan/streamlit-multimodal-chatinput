import sys

import streamlit as st
from multimodal import multimodal_input_component

# Add some myself code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run multimodal_component/example.py`


st.subheader("Chat with Claude3 with Amazon Bedrock")

# Create an instance of our component with a constant `name` arg, and
# print its output value.
num_clicks = multimodal_input_component("World")
# print(num_clicks)
s = f"the url is {num_clicks['prompt']}"
st.markdown(s)

st.markdown("---")


# st.subheader("Component with variable args")

# Create a second instance of our component whose `name` arg will vary
# based on a text_input widget.
#
# We use the special "key" argument to assign a fixed identity to this
# component instance. By default, when a component's arguments change,
# it is considered a new instance and will be re-mounted on the frontend
# and lose its current state. In this case, we want to vary the component's
# "name" argument without having it get recreated.
# name_input = st.text_input("Enter a name", value="Streamlit")
# num_clicks = multimodal_input_component(name_input, key="foo")
# st.markdown("You've clicked %s times!" % int(num_clicks))
