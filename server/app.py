import matplotlib
matplotlib.use('Agg') 
from flask import Flask, jsonify, request, send_file
from flask_restful import Resource, Api
from flask_cors import CORS
from dotenv import load_dotenv
import os
import numpy as np
import matplotlib.pyplot as plt
from tabulate import tabulate 

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
api = Api(app)
FIREBASE_CONFIG = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
}
API_TOKEN = os.getenv("API_TOKEN")
def lagrange_interpolation(x, x_points, y_points):
    n = len(x_points)
    interpolated_value = 0.0
    for i in range(n):
        L_i = 1.0
        for j in range(n):
            if j != i:
                L_i *= (x - x_points[j]) / (x_points[i] - x_points[j])
        interpolated_value += y_points[i] * L_i
    return interpolated_value

def find_missing_points(x_values, step_size):
    missing_points = []
    x_sorted = sorted(x_values)
    for i in range(len(x_sorted) - 1):
        current = x_sorted[i]
        next_expected = current + step_size
        while next_expected < x_sorted[i + 1]:
            missing_points.append(next_expected)
            next_expected += step_size
    return missing_points

def trapezoidal_rule(h, x, y):
    n = len(x) - 1
    integral = 0.5 * (y[0] + y[-1])
    for i in range(1, n):
        integral += y[i]
    return h * integral

def simpsons_rule(h, x, y):
    n = len(x) - 1
    if n % 2 != 0:
        raise ValueError("Number of intervals (n) must be even for Simpson's rule.")
    integral = y[0] + y[-1]
    for i in range(1, n, 2):
        integral += 4 * y[i]
    for i in range(2, n - 1, 2):
        integral += 2 * y[i]
    return (h / 3) * integral

def plot_results(x, y, missing_points, interpolated_values, plot_path, title):
    os.makedirs(os.path.dirname(plot_path), exist_ok=True)

    x_range = np.linspace(min(x), max(x), 500)
    y_range = [lagrange_interpolation(xi, x, y) for xi in x_range]

    plt.figure(figsize=(10, 6))
    plt.plot(x_range, y_range, label="Interpolated Curve", color="green", linestyle="--")
    plt.scatter(x, y, color="red", label="Given Points")
    if missing_points:
        plt.scatter(
            missing_points,
            interpolated_values,
            color="blue",
            label="Missing Points (Interpolated)",
            marker="x",
        )
    plt.title(title)
    plt.xlabel("x")
    plt.ylabel("f(x)")
    plt.legend()
    plt.grid(True)
    plt.savefig(plot_path)
    plt.close()
class FirebaseConfig(Resource):
    def get(self):
        token = request.headers.get("Authorization")
        if token != API_TOKEN:
            return {"error": "Unauthorized"}, 401
        return FIREBASE_CONFIG, 200

class NumericalDifferentiation(Resource):
    def post(self):
        data = request.json
        x = data["xValues"]
        y = data["yValues"]
        h = data["stepSize"]
        x_value = data["point"]

        try:
            interpolated_points = []  


            required_points = {x_value, x_value + h, x_value + 2 * h, x_value - h}
            for point in required_points:
                if point not in x:
                    interpolated_func = lagrange_interpolation(point, x, y)
                    x.append(point)
                    y.append(interpolated_func)
                    interpolated_points.append({"x": point, "f(x)": interpolated_func})


            x, y = (list(t) for t in zip(*sorted(zip(x, y))))


            mx = x.index(x_value)
            jh = x.index(x_value + h) if (x_value + h) in x else None
            dh = x.index(x_value + 2 * h) if (x_value + 2 * h) in x else None
            mh = x.index(x_value - h) if (x_value - h) in x else None


            results = {}

            if jh is not None:
                results["2-point forward"] = (y[jh] - y[mx]) / h
            else:
                results["2-point forward"] = "Missing required points for calculation"
            if jh is not None and dh is not None:
                results["3-point forward"] = (-y[dh] + 4 * y[jh] - 3 * y[mx]) / (2 * h)
            else:
                results["3-point forward"] = "Missing required points for calculation"
            if mh is not None and jh is not None:
                results["3-point central"] = (y[jh] - y[mh]) / (2 * h)
            else:
                results["3-point central"] = "Missing required points for calculation"
            plot_path = "static/differentiation_plot.png"
            plot_results(x, y, [], interpolated_points, plot_path, "Numerical Differentiation")

            return {
                "success": True,
                "sortedX": x,
                "sortedY": y,
                "interpolatedPoints": interpolated_points,
                "derivatives": results,
                "plotPath": plot_path,
            }, 200

        except ValueError as e:
            return {"success": False, "error": str(e)}, 400

def plot_integration(x, y, missing_points, interpolated_values, trapezoidal_result, simpsons_result, figure_name="integration_plot.png"):
    """
    Plots integration results with trapezoidal sections and Simpson's rule segments.
    """
    os.makedirs("./static", exist_ok=True) 


    x_range = np.linspace(min(x), max(x), 500)
    y_range = [lagrange_interpolation(xi, x, y) for xi in x_range]

    plt.figure(figsize=(12, 8))


    plt.plot(x_range, y_range, label="Lagrange Polynomial Curve", linestyle="--", color="green")


    plt.scatter(x, y, color="red", label="Given Points")
    if missing_points:
        plt.scatter(missing_points, interpolated_values, color="blue", label="Interpolated Points", marker='x', s=100)


    for i in range(len(x) - 1):
        plt.fill_between([x[i], x[i+1]], [y[i], y[i+1]], color="yellow", alpha=0.3, label="Trapezoids" if i == 0 else "")


    if len(x) > 2 and (len(x) - 1) % 2 == 0:  
        for i in range(0, len(x) - 2, 2):
            x_segment = x[i:i+3]
            y_segment = y[i:i+3]
            x_range_simpson = np.linspace(x_segment[0], x_segment[-1], 100)
            y_range_simpson = [lagrange_interpolation(xi, x_segment, y_segment) for xi in x_range_simpson]
            plt.plot(
                x_range_simpson,
                y_range_simpson,
                label="Simpson's Rule Segment" if i == 0 else "",
                color="orange"
            )
    plt.title("Interpolation and Numerical Integration")
    plt.xlabel("x")
    plt.ylabel("f(x)")
    plt.legend()
    plt.grid(True)


    plt.savefig(f"./static/{figure_name}")
    plt.close()


class NumericalIntegration(Resource):
    def post(self):
        data = request.json
        x = data["xValues"]
        y = data["yValues"]
        h = data["stepSize"]

        try:
            # Interpolate missing points
            missing_points = find_missing_points(x, h)
            interpolated_values = [
                lagrange_interpolation(point, x, y) for point in missing_points
            ]
            x += missing_points
            y += interpolated_values
            x, y = (list(t) for t in zip(*sorted(zip(x, y))))

            # Perform Integration
            trapezoidal_result = trapezoidal_rule(h, x, y)
            try:
                simpsons_result = simpsons_rule(h, x, y)
            except ValueError as e:
                simpsons_result = str(e)

            # Plot 
            plot_path = "integration_plot.png"
            plot_integration(x, y, missing_points, interpolated_values, trapezoidal_result, simpsons_result, plot_path)

            return {
                "success": True,
                "trapezoidalResult": trapezoidal_result,
                "simpsonsResult": simpsons_result,
                "plotPath": f"./static/{plot_path}",
            }, 200

        except ValueError as e:
            return {"success": False, "error": str(e)}, 400

api.add_resource(FirebaseConfig, "/firebase-config")
api.add_resource(NumericalDifferentiation, "/numerical-differentiation")
api.add_resource(NumericalIntegration, "/numerical-integration")

if __name__ == "__main__":
    app.run(debug=True, port=8000)



# import matplotlib
# matplotlib.use('Agg') 
# from flask import Flask, jsonify, request, send_file
# from flask_restful import Resource, Api
# from flask_cors import CORS
# from dotenv import load_dotenv
# import os
# import numpy as np
# import matplotlib.pyplot as plt
# from tabulate import tabulate  # For data table formatting

# load_dotenv()

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173"])
# api = Api(app)

# # Firebase Configuration
# FIREBASE_CONFIG = {
#     "apiKey": os.getenv("FIREBASE_API_KEY"),
#     "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
#     "projectId": os.getenv("FIREBASE_PROJECT_ID"),
#     "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
#     "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
#     "appId": os.getenv("FIREBASE_APP_ID"),
#     "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
# }
# API_TOKEN = os.getenv("API_TOKEN")


# # Helper Functions
# def lagrange_interpolation(x, x_points, y_points):
#     n = len(x_points)
#     interpolated_value = 0.0
#     for i in range(n):
#         L_i = 1.0
#         for j in range(n):
#             if j != i:
#                 L_i *= (x - x_points[j]) / (x_points[i] - x_points[j])
#         interpolated_value += y_points[i] * L_i
#     return interpolated_value


# def find_missing_points(x_values, step_size):
#     missing_points = []
#     x_sorted = sorted(x_values)
#     for i in range(len(x_sorted) - 1):
#         current = x_sorted[i]
#         next_expected = current + step_size
#         while next_expected < x_sorted[i + 1]:
#             missing_points.append(next_expected)
#             next_expected += step_size
#     return missing_points


# def trapezoidal_rule(h, x, y):
#     n = len(x) - 1
#     integral = 0.5 * (y[0] + y[-1])
#     for i in range(1, n):
#         integral += y[i]
#     return h * integral


# def simpsons_rule(h, x, y):
#     n = len(x) - 1
#     if n % 2 != 0:
#         raise ValueError("Number of intervals (n) must be even for Simpson's rule.")
#     integral = y[0] + y[-1]
#     for i in range(1, n, 2):
#         integral += 4 * y[i]
#     for i in range(2, n - 1, 2):
#         integral += 2 * y[i]
#     return (h / 3) * integral


# def plot_results(x, y, missing_points, interpolated_values, plot_path, title):
#     # Ensure the directory for the plot exists
#     os.makedirs(os.path.dirname(plot_path), exist_ok=True)

#     x_range = np.linspace(min(x), max(x), 500)
#     y_range = [lagrange_interpolation(xi, x, y) for xi in x_range]

#     plt.figure(figsize=(10, 6))
#     plt.plot(x_range, y_range, label="Interpolated Curve", color="green", linestyle="--")
#     plt.scatter(x, y, color="red", label="Given Points")
#     if missing_points:
#         plt.scatter(
#             missing_points,
#             interpolated_values,
#             color="blue",
#             label="Missing Points (Interpolated)",
#             marker="x",
#         )
#     plt.title(title)
#     plt.xlabel("x")
#     plt.ylabel("f(x)")
#     plt.legend()
#     plt.grid(True)
#     plt.savefig(plot_path)
#     plt.close()


# # Firebase Configuration Resource
# class FirebaseConfig(Resource):
#     def get(self):
#         token = request.headers.get("Authorization")
#         if token != API_TOKEN:
#             return {"error": "Unauthorized"}, 401
#         return FIREBASE_CONFIG, 200


# class NumericalDifferentiation(Resource):
#     def post(self):
#         data = request.json
#         x = data["xValues"]
#         y = data["yValues"]
#         h = data["stepSize"]
#         x_value = data["point"]
#         method = data.get("method", "forward")  # Default to forward difference

#         try:
#             # Interpolate missing points
#             missing_points = find_missing_points(x, h)
#             interpolated_values = [
#                 lagrange_interpolation(point, x, y) for point in missing_points
#             ]
#             x += missing_points
#             y += interpolated_values
#             x, y = (list(t) for t in zip(*sorted(zip(x, y))))

#             # Numerical Differentiation
#             if method == "forward":
#                 first_derivative = (lagrange_interpolation(x_value + h, x, y) - lagrange_interpolation(x_value, x, y)) / h
#                 second_derivative = (
#                     lagrange_interpolation(x_value + 2 * h, x, y)
#                     - 2 * lagrange_interpolation(x_value + h, x, y)
#                     + lagrange_interpolation(x_value, x, y)
#                 ) / (h ** 2)
#                 derivative = {
#                     "first_order": first_derivative,
#                     "second_order": second_derivative,
#                 }
#             elif method == "backward":
#                 derivative = (lagrange_interpolation(x_value, x, y) - lagrange_interpolation(x_value - h, x, y)) / h
#             elif method == "central":
#                 derivative = (lagrange_interpolation(x_value + h, x, y) - lagrange_interpolation(x_value - h, x, y)) / (2 * h)
#             else:
#                 return {"success": False, "error": "Invalid differentiation method."}, 400

#             # Plot results
#             plot_path = "static/differentiation_plot.png"
#             plot_results(
#                 x,
#                 y,
#                 missing_points,
#                 interpolated_values,
#                 plot_path,
#                 "Numerical Differentiation",
#             )

#             return {
#                 "success": True,
#                 "sortedX": x,
#                 "sortedY": y,
#                 "interpolatedValues": interpolated_values,
#                 "derivative": derivative,
#                 "plotPath": plot_path,
#             }, 200

#         except ValueError as e:
#             return {"success": False, "error": str(e)}, 400


# # Numerical Integration Resource
# class NumericalIntegration(Resource):
#     def post(self):
#         data = request.json
#         x = data["xValues"]
#         y = data["yValues"]
#         h = data["stepSize"]

#         try:
#             # Interpolate missing points
#             missing_points = find_missing_points(x, h)
#             interpolated_values = [
#                 lagrange_interpolation(point, x, y) for point in missing_points
#             ]
#             x += missing_points
#             y += interpolated_values
#             x, y = (list(t) for t in zip(*sorted(zip(x, y))))

#             # Trapezoidal and Simpson's Rule
#             trapezoidal_result = trapezoidal_rule(h, x, y)
#             try:
#                 simpsons_result = simpsons_rule(h, x, y)
#             except ValueError as e:
#                 simpsons_result = str(e)

#             # Data table
#             data_table = [{"x": xi, "f(x)": yi} for xi, yi in zip(x, y)]

#             # Plot results
#             plot_path = "static/integration_plot.png"
#             plot_results(
#                 x,
#                 y,
#                 missing_points,
#                 interpolated_values,
#                 plot_path,
#                 "Numerical Integration",
#             )

#             return {
#                 "success": True,
#                 "sortedX": x,
#                 "sortedY": y,
#                 "interpolatedValues": interpolated_values,
#                 "trapezoidalResult": trapezoidal_result,
#                 "simpsonsResult": simpsons_result,
#                 "dataTable": data_table,
#                 "plotPath": plot_path,
#             }, 200

#         except ValueError as e:
#             return {"success": False, "error": str(e)}, 400


# # Download Plot Resource
# class DownloadPlot(Resource):
#     def get(self):
#         plot_path = request.args.get("plotPath")
#         return send_file(plot_path, mimetype="image/png")


# # Add Resources to API
# api.add_resource(FirebaseConfig, "/firebase-config")
# api.add_resource(NumericalDifferentiation, "/numerical-differentiation")
# api.add_resource(NumericalIntegration, "/numerical-integration")
# api.add_resource(DownloadPlot, "/download-plot")

# if __name__ == "__main__":
#     app.run(debug=True, port=8000)
