import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStopCircle } from "@fortawesome/free-solid-svg-icons";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export const Contact = (props) => {
  const [{ name, email, message }, setState] = useState(initialState);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US"; // You can set the desired language

      speechRecognition.onstart = () => {
        setIsRecording(true);
      };

      speechRecognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setState((prevState) => ({ ...prevState, message: finalTranscript }));
      };

      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      setRecognition(speechRecognition);
    } else {
      console.warn("Browser does not support Speech Recognition API.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);

    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_PUBLIC_KEY")
      .then(
        (result) => {
          console.log(result.text);
          clearState();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const startRecording = () => {
    if (recognition && !isRecording) {
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

const handleSend = () => {
  const dataToSend = {
    message,
    name,
    email,
  };

  fetch('/api/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Webhook response:', data);
    })
    .catch((error) => {
      console.error('Error sending to proxy webhook:', error);
    });
};

  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch in our voice form</h2>
                <p>
                Speak your message instead of typing! Fill out the form below or record your voice, and we'll get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" validate onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    value={message}
                    onChange={handleChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                 <div className="voice-input-controls flex gap-3 mt-2">
  <button
    type="button"
    onClick={startRecording}
    disabled={isRecording || !recognition}
    className={`px-4 py-2 rounded font-semibold transition ${
      isRecording
        ? "bg-red-500 text-white border border-red-500"
        : "bg-white text-gray-800 border border-gray-300"
    }`}
  >
    <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
    {isRecording ? "Recording..." : "Record"}
  </button>
  <button
    type="button"
    onClick={stopRecording}
    disabled={!isRecording || !recognition}
    className="px-4 py-2 rounded bg-white text-gray-800 border border-gray-300 font-semibold transition disabled:opacity-50"
  >
    <FontAwesomeIcon icon={faStopCircle} className="mr-2" /> Stop
  </button>
</div>
                <div id="success"></div>
                <button onClick={handleSend} type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
{/*                 <div>
                  <a
    style={{
      textTransform: "uppercase",
      fontSize: "14px",
      cursor: "pointer",
      padding: "12px 18px",
      fontFamily: "inherit",
      backgroundColor: "#0075E3",
      border: "1px solid #0075E3",
      color: "#FFFFFF",
      borderRadius: "4px",
      textDecoration: "none",
      display: "inline-block"
    }}
    href="javascript:void(window.open('https://eu.jotform.com/agent/019661f2fdd17f3f9a1b363a14ef6aca6dc8/voice?embedMode=popup&parentURL='+encodeURIComponent(window.top.location.href),'blank','scrollbars=yes,toolbar=no,width=700,height=500,top='+((window.outerHeight / 2) - 250)+',left='+((window.outerWidth / 2) - 350)))"
  >
    🎤 Sales AI Agent
  </a>
</div> */}
              </form>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.youtube : "/"}>
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2023 Issaaf Kattan React Land Page Template. Design by{" "}
            <a href="http://www.templatewire.com" rel="nofollow">
              TemplateWire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
